import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTheme, toggleTheme as toggleThemeAction, setTheme as setThemeAction } from '../../store/uiSlice';

const STORAGE_KEY = 'motomedic-theme';

export const useTheme = () => {
  const theme = useSelector(selectTheme);
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    root.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(
    () => dispatch(toggleThemeAction()),
    [dispatch]
  );

  const setTheme = useCallback(
    (newTheme) => dispatch(setThemeAction(newTheme)),
    [dispatch]
  );

  return {
    theme,
    isDarkMode: theme === 'dark',
    setTheme,
    toggleTheme,
  };
};

export default useTheme;