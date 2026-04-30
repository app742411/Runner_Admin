import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import navData from './nav-data';

const NavSection = () => {
  const permissions = useSelector((state) => state.auth.permissions);
  const { t } = useTranslation();

  const filteredNav = navData
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !item.permission || permissions.includes(item.permission)
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <>
      {filteredNav.map((section) => (
        <div key={section.subheader}>
          <h6>{t(section.subheader)}</h6>

          {section.items.map((item) => (
            <div key={item.title}>
              {item.icon}
              {/* <span>{t(item.title)}</span> */}
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default NavSection;
