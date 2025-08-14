export type Subscriber = () => void;

export type OverlayProps = {
  [key: string]: any;
  overlayKey: string;
  resolve?: (value: unknown) => void;
  duration?: number;
  dismissOnInteraction?: boolean;
};

export type OverlayType<P = OverlayProps> = (props: P) => any;

export type OverlayStackItem<P = OverlayProps> = {
  overlayKey: string;
  overlay: OverlayType;
  resolve: (value: unknown) => void;
  props: Omit<P, 'resolve'>;
};

export type OverlayStack<P = OverlayProps> = OverlayStackItem<P>[];

export type OverlayState = {
  stack: OverlayStack;
};

export type OverlayAction =
  | { type: 'PUSH'; payload: OverlayStackItem }
  | { type: 'POP' }
  | { type: 'REMOVE'; payload: { overlayKey: string } }
  | { type: 'CLEAR' };

export type ReactOverlayElement = React.ReactElement<OverlayProps & { key?: string }>;
