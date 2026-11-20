/**
 * Native buttons inherit a grey browser face on web and a system tint on Android.
 * Every <Pressable> used as a button clears it first, exactly like `BTN_RESET` on web.
 */
export const BTN_RESET = { backgroundColor: 'transparent', borderWidth: 0 } as const;
