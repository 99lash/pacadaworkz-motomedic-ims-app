import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useActivityLogs from '../useActivityLogs';
import { activityLogsService } from '../../services';

// Mock the service
vi.mock('../../services', () => ({
  activityLogsService: {
    fetchActivityLogs: vi.fn(),
  },
}));

describe('useActivityLogs', () => {
  const mockUser = { id: 1, role: 'admin' };
  const mockLogs = [
    { 
      timestamp: '2023-01-01', 
      user: 'Test User', 
      module: 'Auth', 
      action: 'Login', 
      details: 'User logged in' 
    },
    { 
      timestamp: '2023-01-02', 
      user: 'Test User', 
      module: 'Products', 
      action: 'Create', 
      details: 'Created product' 
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch logs on mount', async () => {
    activityLogsService.fetchActivityLogs.mockResolvedValue({ success: true, data: mockLogs });

    const { result } = renderHook(() => useActivityLogs(mockUser));

    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.logs).toEqual([]);

    // Wait for update
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.logs).toEqual(mockLogs);
    expect(activityLogsService.fetchActivityLogs).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch error', async () => {
    activityLogsService.fetchActivityLogs.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useActivityLogs(mockUser));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.logs).toEqual([]);
  });

  it('should filter logs by search term', async () => {
    activityLogsService.fetchActivityLogs.mockResolvedValue({ success: true, data: mockLogs });

    const { result } = renderHook(() => useActivityLogs(mockUser));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.handleSearchChange('Login');
    });

    // filteredLogs should update
    expect(result.current.filteredLogs).toHaveLength(1);
    expect(result.current.filteredLogs[0].action).toBe('Login');
  });
});
