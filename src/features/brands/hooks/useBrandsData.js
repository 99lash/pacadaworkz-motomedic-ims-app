import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { brandService } from '../services';

export const useBrandsData = () => {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadBrands = useCallback(async () => {
    if (!isMountedRef.current) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await brandService.fetchBrands();
      if (isMountedRef.current) {
        if (result.success) {
          setBrands(result.data);
        } else {
          setError(result.error || 'Failed to load brands');
          toast.error(result.error || 'Failed to load brands');
        }
      }
    } catch (err) {
      if (isMountedRef.current) {
        const errorMessage = 'Failed to load brands';
        setError(errorMessage);
        console.error('Error loading brands:', err);
        toast.error(errorMessage);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  const createBrand = useCallback(async (brandData) => {
    if (!isMountedRef.current) return { success: false };

    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimisticBrand = { id: tempId, ...brandData, isOptimistic: true };
    setBrands(prev => [...prev, optimisticBrand]);

    try {
      const result = await brandService.createBrand(brandData);
      if (isMountedRef.current) {
        if (result.success) {
          // Replace optimistic with real data
          setBrands(prev => prev.map(brand =>
            brand.id === tempId ? result.data : brand
          ));
          toast.success('Brand created successfully');
        } else {
          // Revert optimistic update
          setBrands(prev => prev.filter(brand => brand.id !== tempId));
          toast.error(result.error || 'Failed to create brand');
        }
      }
      return result;
    } catch (err) {
      if (isMountedRef.current) {
        // Revert optimistic update
        setBrands(prev => prev.filter(brand => brand.id !== tempId));
        console.error('Error creating brand:', err);
        toast.error('Failed to create brand');
      }
      return { success: false, error: 'Failed to create brand' };
    }
  }, []);

  const updateBrand = useCallback(async (id, brandData) => {
    if (!isMountedRef.current) return { success: false };

    // Optimistic update
    const originalBrand = brands.find(brand => brand.id === id);
    if (!originalBrand) return { success: false };

    const updatedBrand = { ...originalBrand, ...brandData, isOptimistic: true };
    setBrands(prev => prev.map(brand =>
      brand.id === id ? updatedBrand : brand
    ));

    try {
      const result = await brandService.updateBrand(id, brandData);
      if (isMountedRef.current) {
        if (result.success) {
          // Update with real data
          setBrands(prev => prev.map(brand =>
            brand.id === id ? result.data : brand
          ));
          toast.success('Brand updated successfully');
        } else {
          // Revert to original
          setBrands(prev => prev.map(brand =>
            brand.id === id ? originalBrand : brand
          ));
          toast.error(result.error || 'Failed to update brand');
        }
      }
      return result;
    } catch (err) {
      if (isMountedRef.current) {
        // Revert to original
        setBrands(prev => prev.map(brand =>
          brand.id === id ? originalBrand : brand
        ));
        console.error('Error updating brand:', err);
        toast.error('Failed to update brand');
      }
      return { success: false, error: 'Failed to update brand' };
    }
  }, [brands]);

  const deleteBrand = useCallback(async (id) => {
    if (!isMountedRef.current) return { success: false };

    // Optimistic update
    const brandToDelete = brands.find(brand => brand.id === id);
    if (!brandToDelete) return { success: false };

    setBrands(prev => prev.filter(brand => brand.id !== id));

    try {
      const result = await brandService.deleteBrand(id);
      if (isMountedRef.current) {
        if (result.success) {
          toast.success('Brand deleted successfully');
        } else {
          // Restore the brand
          setBrands(prev => [...prev, brandToDelete].sort((a, b) => a.id - b.id));
          toast.error(result.error || 'Failed to delete brand');
        }
      }
      return result;
    } catch (err) {
      if (isMountedRef.current) {
        // Restore the brand
        setBrands(prev => [...prev, brandToDelete].sort((a, b) => a.id - b.id));
        console.error('Error deleting brand:', err);
        toast.error('Failed to delete brand');
      }
      return { success: false, error: 'Failed to delete brand' };
    }
  }, [brands]);

  return {
    brands,
    isLoading,
    error,
    loadBrands,
    createBrand,
    updateBrand,
    deleteBrand,
  };
};