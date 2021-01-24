import browser from 'webextension-polyfill';
import create from 'zustand';

const useStore = create(set => {
  return {
    active: false,
    setActive: active => {
      browser.storage.sync.set({ active });
      return set(() => ({ active }));
    },
    fetch: async () => {
      const { active } = await browser.storage.sync.get({ active: false });
      set({ active });
    },
  };
});

export default useStore;
