import React from 'react';
import Link from 'next/link';
const Header = () => (
  <React.Fragment>
    <Link href="/">
      <a>ME</a>
    </Link>
    <Link href="/you">
      <a>YOU</a>
    </Link>
  </React.Fragment>
);

export default Header;
