import dynamic from 'next/dynamic';
import React, { ReactNode } from 'react';

type NoSsrProps = {
    children: ReactNode
}

const NoSsr = (props: NoSsrProps) => (
  <React.Fragment>{props.children}</React.Fragment>
);

export default dynamic(() => Promise.resolve(NoSsr), {
  ssr: false
});
