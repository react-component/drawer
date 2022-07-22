import * as React from 'react';

export interface DrawerContextProps {
  pushDistance?: number | string;
  push: VoidFunction;
  pull: VoidFunction;
}

const DrawerContext = React.createContext<DrawerContextProps>(null);

export default DrawerContext;
