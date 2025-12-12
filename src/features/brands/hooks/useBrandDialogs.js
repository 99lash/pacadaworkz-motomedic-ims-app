import { useState, useCallback } from 'react';

export const useBrandDialogs = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);

  const openFormDialog = useCallback(() => {
    setIsFormOpen(true);
  }, []);

  const closeFormDialog = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  const openDeleteDialog = useCallback((brand) => {
    setBrandToDelete(brand);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setBrandToDelete(null);
    setIsDeleteOpen(false);
  }, []);

  return {
    isFormOpen,
    isDeleteOpen,
    brandToDelete,
    openFormDialog,
    closeFormDialog,
    openDeleteDialog,
    closeDeleteDialog,
  };
};