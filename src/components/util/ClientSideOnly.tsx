import dynamic from 'next/dynamic';
import React, { FC, ReactNode } from 'react';


const ClientSideOnly: FC<{children: ReactNode}> = ({children}) => (
  <React.Fragment>{children}</React.Fragment>
);

export default dynamic(() => Promise.resolve(ClientSideOnly), {
  ssr: false
});
