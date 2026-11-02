import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, View } from 'react-native';
import { STAGE_CHARACTERS } from '@/data/characters';

type Props = { reveal?: number };

function Slot({
  source,
  width,
  tilt,
  zIndex,
  delay,
}: {
  source: number;
  width: number;
  tilt: number;
  zIndex: number;
  delay: number;
}) {
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: 2800,
          delay,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 2800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [bob, delay]);

  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  return (
    <Animated.View
      style={[
        styles.slot,
        { width, zIndex, transform: [{ translateY }, { rotate: `${tilt}deg` }] },
      ]}
    >
      <Image
        source={source}
        style={[styles.image, { width, height: width * 1.3 }]}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

/** Three characters, three DIFFERENT gestures, floating on the backdrop. */
export function CharacterStage({ reveal = 1 }: Props) {
  const count = STAGE_CHARACTERS.length;

  return (
    <View style={styles.stage} pointerEvents="none">
      {STAGE_CHARACTERS.map((c, i) => {
        const isCenter = i === Math.floor(count / 2);
        return (
          <Slot
            key={c.id}
            source={c.source}
            width={isCenter ? 148 : 106}
            tilt={isCenter ? c.tilt : c.tilt * 1.6}
            zIndex={isCenter ? 3 : 1}
            delay={i * 260}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    // negative gap equivalent: slight overlap keeps the trio large on narrow phones
    marginHorizontal: -4,
    width: '100%',
  },
  slot: { alignItems: 'center' },
  // NOTE: no shadow props here on purpose — RN's shadow* draws around the
  // element box, which paints a visible rectangle behind transparent PNGs.
  image: {},
});
