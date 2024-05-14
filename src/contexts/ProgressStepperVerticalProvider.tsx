import React, { useState, createContext, useEffect } from 'react';
import type { TextStyle } from 'react-native';
import type { ViewStyle } from 'react-native';

import { Dimensions } from 'react-native';
import {
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

export type ProgressStepperVerticalProviderProps = {
  children: React.ReactNode;
  height?: number;
  steps?: string[];
  initialPosition?: number;
  animationDuration?: number;
  animationDelay?: number;
  stepHeight?: number;
  stepStyle?: ViewStyle;
  trackWidth?: number;
  containerWidth?: number;
  activeColor?: string;
  inactiveColor?: string;
  showLabels?: boolean;
  trackActiveColor?: string;
  trackInactiveColor?: string;
  labelOffset?: number;
  labelStyle?: TextStyle;
  innerLabelStyle?: TextStyle;
  extended?: boolean;
  renderInnerStep?:
    | ((stepLabel: string, stepNumber: number) => React.ReactNode)
    | null;
  renderStep?: ((stepLabel: string, index: number) => React.ReactNode) | null;
};

export type ProgressStepperVerticalContextValue =
  | ({
      currentPosition: number;
      setCurrentPosition: React.Dispatch<React.SetStateAction<number>>;
      goToNext: () => void;
      goToPrevious: () => void;
      progress: SharedValue<number>;
      perStepHeight: number;
    } & Required<Omit<ProgressStepperVerticalProviderProps, 'children'>>)
  | null;

export const ProgressStepperVerticalContext =
  createContext<ProgressStepperVerticalContextValue>(null);

const windowHeight = Dimensions.get('window').height;
// const windowHeight = Dimensions.get('window').height;

export default function ProgressStepperVerticalProvider({
  children,
  height = windowHeight,
  steps = ['Menu', 'Cart', 'Checkout'],
  initialPosition = 0,
  animationDuration = 300,
  animationDelay = 700,
  trackWidth = 6,
  containerWidth = 60,
  stepHeight = 60,
  stepStyle = {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'pink',
  },
  showLabels = true,
  activeColor = '#FF0000',
  inactiveColor = '#DEDEDE',
  trackActiveColor = activeColor,
  trackInactiveColor = inactiveColor,
  labelOffset = 30,
  labelStyle = {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
  },
  innerLabelStyle = {
    color: 'white',
    fontWeight: 'bold',
  },
  extended = false,
  renderInnerStep = null,
  renderStep = null,
}: ProgressStepperVerticalProviderProps) {
  const [currentPosition, setCurrentPosition] =
    useState<number>(initialPosition);
  const progress_steps = extended ? steps.length + 1 : steps.length - 1;
  const perStepHeight = height / progress_steps;
  const progress = useSharedValue<number>(perStepHeight * currentPosition);

  const animateProgress = (position: number) => {
    const widthValueForStep =
      perStepHeight * (extended ? position : position - 1);
    progress.value = withDelay(
      animationDelay,
      withTiming(widthValueForStep, {
        duration: animationDuration,
      })
    );
  };

  useEffect(() => {
    animateProgress(currentPosition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPosition]);

  const goToNext = () => {
    setCurrentPosition((prevPosition) => {
      if (prevPosition + 1 <= (extended ? steps.length + 1 : steps.length)) {
        return prevPosition + 1;
      } else {
        return prevPosition;
      }
    });
  };
  const goToPrevious = () => {
    setCurrentPosition((prevPosition) => {
      if (prevPosition - 1 >= 0) {
        return prevPosition - 1;
      } else {
        return prevPosition;
      }
    });
  };

  return (
    <ProgressStepperVerticalContext.Provider
      value={{
        currentPosition,
        setCurrentPosition,
        goToNext,
        goToPrevious,
        steps,
        height,
        initialPosition,
        animationDuration,
        animationDelay,
        stepStyle,
        showLabels,
        activeColor,
        inactiveColor,
        trackWidth,
        containerWidth,
        stepHeight,
        trackActiveColor,
        trackInactiveColor,
        labelOffset,
        labelStyle,
        innerLabelStyle,
        progress,
        perStepHeight,
        extended,
        renderInnerStep,
        renderStep,
      }}
    >
      {children}
    </ProgressStepperVerticalContext.Provider>
  );
}
