/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Link from 'next/link';
import Image from 'next/image';

import styles from './header.module.scss';
import commonStyles from '../../styles/common.module.scss';

export default function Header() {
  return (
    <nav className={`${commonStyles.mainContainer} ${styles.container}`}>
      <Link href="/">
        <a>
          <img src="/logo.svg" alt="logo" />
        </a>
      </Link>
    </nav>
  );
}
