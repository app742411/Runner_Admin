import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { menuByRole } from 'src/config/menuByRole';

import navData from '../nav-data';

export function useNavData() {
  const user = useSelector((state) => state.auth.user);
  const permissions = useSelector((state) => state.auth.permissions);
  const { t, i18n } = useTranslation();

  const role = user?.role;

  return useMemo(() => {
    return navData
      .map((section) => {
        const roleMenu = menuByRole[role] || [];

        const filteredItems = section.items
          .filter((item) => {
            // Filter by Role (using menuByRole config)
            return roleMenu.includes(item.id);
          })
          .sort((a, b) => roleMenu.indexOf(a.id) - roleMenu.indexOf(b.id))
          .map((item) => {
            const translateItem = (navItem) => ({
              ...navItem,
              title: t(navItem.title),
              ...(navItem.children && {
                children: navItem.children.map(translateItem),
              }),
            });

            return translateItem(item);
          });

        return {
          ...section,
          // TRANSLATE SUBHEADER
          subheader: section.subheader ? t(section.subheader) : section.subheader,
          items: filteredItems,
        };
      })
      .filter((section) => section.items.length > 0);
  }, [role, t]);
}
