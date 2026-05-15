import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Pressable, View, type LayoutChangeEvent, type PressableProps } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedText = Animated.createAnimatedComponent(Text);

type AnimatedTabItem<Value extends string> = {
  label: string;
  value: Value;
  disabled?: boolean;
};

type AnimatedTabsProps<Value extends string> = {
  items: AnimatedTabItem<Value>[];
  value: Value;
  onValueChange: (value: Value) => void;
  maxPerRow?: number;
  className?: string;
  trackClassName?: string;
  rowClassName?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  activeIndicatorClassName?: string;
  labelClassName?: string;
  activeLabelClassName?: string;
  disabled?: boolean;
};

type AnimatedTabButtonProps<Value extends string> = {
  item: AnimatedTabItem<Value>;
  selected: boolean;
  onSelect: (value: Value) => void;
  className?: string;
  labelClassName?: string;
  activeLabelClassName?: string;
  disabled?: boolean;
};

type AnimatedTabRowProps<Value extends string> = {
  row: AnimatedTabItem<Value>[];
  value: Value;
  onValueChange: (value: Value) => void;
  trackClassName?: string;
  rowClassName?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  activeIndicatorClassName?: string;
  labelClassName?: string;
  activeLabelClassName?: string;
  disabled?: boolean;
};

function chunkItems<Value extends string>(items: AnimatedTabItem<Value>[], maxPerRow: number) {
  const rows: AnimatedTabItem<Value>[][] = [];

  for (let index = 0; index < items.length; index += maxPerRow) {
    rows.push(items.slice(index, index + maxPerRow));
  }

  return rows;
}

function AnimatedTabButton<Value extends string>({
  item,
  selected,
  onSelect,
  className,
  labelClassName,
  activeLabelClassName,
  disabled,
}: AnimatedTabButtonProps<Value>) {
  const isDisabled = disabled || item.disabled;
  const progress = useDerivedValue(() =>
    withTiming(selected ? 1 : 0, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    })
  );

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], ['#9ca3af', '#ffffff']),
  }));

  const handlePress: PressableProps['onPress'] = () => {
    if (!isDisabled && !selected) {
      onSelect(item.value);
    }
  };

  return (
    <AnimatedPressable
      accessibilityRole="tab"
      accessibilityState={{ selected, disabled: isDisabled }}
      className={cn(
        'z-10 h-10 flex-1 items-center justify-center rounded-lg px-3',
        isDisabled && 'opacity-40',
        className
      )}
      disabled={isDisabled}
      onPress={handlePress}
    >
      <AnimatedText
        className={cn(
          'text-center text-sm font-semibold',
          labelClassName,
          selected && activeLabelClassName
        )}
        numberOfLines={1}
        style={labelStyle}
      >
        {item.label}
      </AnimatedText>
    </AnimatedPressable>
  );
}

function AnimatedTabRow<Value extends string>({
  row,
  value,
  onValueChange,
  trackClassName,
  rowClassName,
  tabClassName,
  activeTabClassName,
  activeIndicatorClassName,
  labelClassName,
  activeLabelClassName,
  disabled,
}: AnimatedTabRowProps<Value>) {
  const [trackWidth, setTrackWidth] = React.useState(0);
  const selectedIndex = row.findIndex((item) => item.value === value);
  const activeIndex = useSharedValue(selectedIndex);
  const hasActiveTab = selectedIndex >= 0;
  const tabWidth = trackWidth > 0 ? trackWidth / row.length : 0;
  const indicatorInset = Math.min(6, tabWidth * 0.12);
  const indicatorWidth = Math.max(0, tabWidth - indicatorInset * 2);

  React.useEffect(() => {
    activeIndex.value = withTiming(selectedIndex, {
      duration: 260,
      easing: Easing.out(Easing.cubic),
    });
  }, [activeIndex, selectedIndex]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: withTiming(hasActiveTab && trackWidth > 0 ? 1 : 0, {
      duration: 140,
      easing: Easing.out(Easing.cubic),
    }),
    transform: [{ translateX: activeIndex.value * tabWidth + indicatorInset }],
    width: indicatorWidth,
  }));

  return (
    <View
      className={cn('relative flex-row overflow-hidden rounded-xl bg-gray-900 p-1', trackClassName)}
    >
      {trackWidth > 0 && (
        <Animated.View
          className={cn(
            'absolute bottom-2 left-1 top-2 rounded-lg bg-green-500',
            activeTabClassName,
            activeIndicatorClassName
          )}
          style={indicatorStyle}
        />
      )}

      <View className={cn('flex-1 flex-row', rowClassName)} onLayout={handleLayout}>
        {row.map((item) => (
          <AnimatedTabButton
            activeLabelClassName={activeLabelClassName}
            className={tabClassName}
            disabled={disabled}
            item={item}
            key={item.value}
            labelClassName={labelClassName}
            onSelect={onValueChange}
            selected={item.value === value}
          />
        ))}
      </View>
    </View>
  );
}

function AnimatedTabs<Value extends string>({
  items,
  value,
  onValueChange,
  maxPerRow = 3,
  className,
  trackClassName,
  rowClassName,
  tabClassName,
  activeTabClassName,
  activeIndicatorClassName,
  labelClassName,
  activeLabelClassName,
  disabled,
}: AnimatedTabsProps<Value>) {
  const safeMaxPerRow = Math.max(1, Math.floor(maxPerRow));
  const rows = React.useMemo(() => chunkItems(items, safeMaxPerRow), [items, safeMaxPerRow]);

  return (
    <View className={cn('gap-2', className)} role="tablist">
      {rows.map((row, rowIndex) => (
        <AnimatedTabRow
          activeIndicatorClassName={activeIndicatorClassName}
          activeLabelClassName={activeLabelClassName}
          activeTabClassName={activeTabClassName}
          disabled={disabled}
          key={`tab-row-${rowIndex}`}
          labelClassName={labelClassName}
          onValueChange={onValueChange}
          row={row}
          rowClassName={rowClassName}
          tabClassName={tabClassName}
          trackClassName={trackClassName}
          value={value}
        />
      ))}
    </View>
  );
}

export { AnimatedTabs };
export type { AnimatedTabItem, AnimatedTabsProps };
