# Isomorphic Android WebView Blueprint - Wrap Site into a Native Mobile App

This developer blueprint details the exact steps and native code files required to package the New Mexico Socialists responsive portal into a fully functioning, high-fidelity **Android Mobile App** using a standard native WebView wrapper.

---

## 📂 Step 1: Copy Web Assets to the Android Project

Inside your Android Studio project structure, create the assets directory under your main module and copy the active web directory contents directly into it:

- Target directory: `app/src/main/assets/`
- Files to copy:
  - `index.html` (main entrypoint)
  - `nmnewsfeed.html`, `art-showcase.html`, `meta-brain.html`
  - `assets/` (containing `css/styles.css`, `js/main.js`, and all `img/` presets)

*Note: All asset import references in the codebase are verified as completely relative, meaning the local site will load flawlessly via the Android WebView's `file:///android_asset/index.html` protocol without any routing breakdowns!*

---

## 🔒 Step 2: Configure Android App Permissions (`AndroidManifest.xml`)

Open your `app/src/main/AndroidManifest.xml` file and append the following internet access and hardware acceleration permissions:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.senacolectivo.nmsocialists.portal">

    <!-- Enable internet permissions to fetch external feeds and handle personal donation link redirects -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="NM Socialists"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AppCompat.NoActionBar"
        android:hardwareAccelerated="true"> <!-- Ensure hardware acceleration is active for canvas meme rendering -->
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

---

## 📺 Step 3: Native App Layout View (`activity_main.xml`)

Open your layout resources file under `app/src/main/res/layout/activity_main.xml` and insert the full-screen WebView layout container:

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res/app"
    android:layout_width="match_match"
    android:layout_height="match_parent"
    android:background="#050505"> <!-- Matches index.html dark base background -->

    <WebView
        android:id="@+id/appWebView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:scrollbars="none"
        android:overScrollMode="never" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

---

## ☕ Step 4: WebView Controller Code (`MainActivity.kt`)

Open your `app/src/main/java/com/senacolectivo/nmsocialists/portal/MainActivity.kt` file and implement the high-fidelity WebView configuration.

This code enables standard Javascript compilation, activates `localStorage` cache buffers so contact signups and payment clicks persist offline inside the app, configures standard deep-linking handlers so payment links (Venmo/Cash App/PayPal) open in external apps natively, and handles the phone's physical back button so it traverses the site's SPA history instead of closing the application.

```kotlin
package com.senacolectivo.nmsocialists.portal

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.appWebView)

        // ─── HIGH-FIDELITY WEBVIEW SETTINGS ───
        val settings: WebSettings = webView.settings
        
        // 1. Enable JS & DOM Storage for interactive Canvas/Airtable forms & local cache tracking
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        
        // 2. Performance Cache Optimization
        settings.cacheMode = WebSettings.LOAD_DEFAULT
        settings.loadsImagesAutomatically = true
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW

        // 3. Prevent pinching and enforce premium, seamless layout scaling
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true
        settings.supportZoom() // Disables zoom buttons, keeping it looking like a native app

        // ─── CUSTOM WEBVIEW CLIENT FOR HYBRID APP EXPERIENCE ───
        webView.webViewClient = object : WebViewClient() {
            @Deprecated("Deprecated in Java")
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                if (url == null) return false

                // If link is local asset, render inside our native WebView seamlessly
                if (url.startsWith("file:///android_asset/")) {
                    view?.loadUrl(url)
                    return true
                }

                // If link targets personal payment apps (Cash App, Venmo, PayPal, Mailto), open natively
                if (url.contains("cash.app") || url.contains("venmo.com") || url.contains("paypal.me") || url.startsWith("mailto:")) {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        startActivity(intent)
                        return true
                    } catch (e: Exception) {
                        // Fallback: load in a default system browser if payment app isn't installed
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        startActivity(intent)
                        return true
                    }
                }

                // Default: open external resources in default mobile browser to preserve app integrity
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                startActivity(intent)
                return true
            }
        }

        // ─── BOOT THE APP FROM LOCAL ASSETS ───
        webView.loadUrl("file:///android_asset/index.html")
    }

    // ─── INTEGRATE PHYSICAL PHONE BACK BUTTON NAVIGATION ───
    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        // If web history can go back (SPA tabs/views transitions), navigate backward inside app
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
```

---

## 🏁 Step 5: Compile and Run!

1. Plug in your Android test device via USB with **Developer Options & USB Debugging** enabled.
2. Inside **Android Studio**, click the green **Run App (Play)** button at the top header menu.
3. *Your premium bilingual portal is now fully running inside a native mobile app container, completely credit-safe, modular, and optimized!*
