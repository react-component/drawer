import type { DrawerProps } from '@rc-component/drawer';
import './assets/motion.less';

export const maskMotion: DrawerProps['maskMotion'] = {
  motionAppear: true,
  motionName: 'mask-motion',
  onAppearEnd: console.warn,
};

export const motion: DrawerProps['motion'] = placement => ({
  motionAppear: true,
  motionName: `panel-motion-${placement}`,
  motionDeadline: 1000,
});

const motionProps: Partial<DrawerProps> = {
  maskMotion,
  motion,
};

export default motionProps;
