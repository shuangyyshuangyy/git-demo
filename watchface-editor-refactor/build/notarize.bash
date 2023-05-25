#!/bin/zsh
xcrun altool --notarize-app --primary-bundle-id "com.miui.maml-widget-editor" --username "rentianfu@xiaomi.com" --password "anol-iasn-hvvg-knaq" --asc-provider "BeijingXiaomiCoLtd" -t osx --file /Users/qinchong/xiaomi/maml-editor/release/0.0.6/WidgetEditor_arm64_0.0.6.zip

xcrun altool --notarize-app --primary-bundle-id "com.miui.maml-widget-editor" --username "rentianfu@xiaomi.com" --password "anol-iasn-hvvg-knaq" --asc-provider "BeijingXiaomiCoLtd" -t osx --file /Users/qinchong/xiaomi/maml-editor/release/0.0.6/WidgetEditor_x64_0.0.6.zip
