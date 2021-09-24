package com.zego.express;

import android.util.Log;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Locale;

public class ZegoLog {

    static Class<?> engineClass;
    static Method logMethod;

    public static void log(String format, Object... args) {
        String message = String.format(Locale.ENGLISH, format, args);
        Log.d("ZEGO", "[UniApp] " + message);
        ZegoLog.logNotice(message);
    }

    public static void error(String format, Object... args) {
        String message = String.format(Locale.ENGLISH, format, args);
        Log.e("ZEGO", "[UniApp] [ERROR] " + message);
        ZegoLog.logNotice(message);
    }

    private static void logNotice(String message) {
        if (engineClass == null || logMethod == null) {
            try {
                engineClass = Class.forName("im.zego.zegoexpress.internal.ZegoExpressEngineInternalImpl");
                logMethod = engineClass.getDeclaredMethod("logNotice", String.class, String.class);
                logMethod.setAccessible(true);
            } catch (ClassNotFoundException e) {
                Log.e("ZEGO", "[UniApp] logNotice failed, class ZegoExpressEngineInternalImpl not found.");
            } catch (NoSuchMethodException e) {
                Log.e("ZEGO", "[UniApp] logNotice failed, method logNotice not found.");
            }
        }

        try {
            if (logMethod != null) {
                logMethod.invoke(null, message, "UniApp");
            }
        } catch (IllegalAccessException e) {
            Log.e("ZEGO", "[UniApp] logNotice failed, IllegalAccessException.");
        } catch (InvocationTargetException e) {
            Log.e("ZEGO", "[UniApp] logNotice failed, InvocationTargetException.");
        }
    }
}
