import { EventData, Page, View, WebView, Utils } from '@nativescript/core';
import { MainViewModel, PromoProduct } from './main-view-model';

let vm: MainViewModel;

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    if (!vm) {
        vm = new MainViewModel();
    }
    page.bindingContext = vm;
}

export function decreaseCartItemQty(args: EventData) {
    if (vm) {
        vm.decreaseCartItemQty(args);
    }
}

export function increaseCartItemQty(args: EventData) {
    if (vm) {
        vm.increaseCartItemQty(args);
    }
}

export function removeCartItem(args: EventData) {
    if (vm) {
        vm.removeCartItem(args);
    }
}

export function onWebViewLoaded(args: EventData) {
    const webView = <WebView>args.object;
    
    if (webView.android) {
        const settings = webView.android.getSettings();
        settings.setJavaScriptEnabled(true);

        try {
            const CustomWebViewClient = (android.webkit.WebViewClient as any).extend({
                shouldOverrideUrlLoading: function(view: any, requestOrUrl: any): boolean {
                    let url = "";
                    if (typeof requestOrUrl === "string") {
                        url = requestOrUrl;
                    } else if (requestOrUrl && typeof requestOrUrl.getUrl === "function") {
                        url = requestOrUrl.getUrl().toString();
                    }

                    if (url && (url.includes('select-promo') || url.includes('id='))) {
                        const match = url.match(/id=(\d+)/);
                        if (match && match[1] && vm) {
                            const id = parseInt(match[1], 10);
                            const promo = vm.promotions.find(p => p.id === id);
                            if (promo) {
                                Utils.dispatchToMainThread(() => {
                                    vm.selectProductForCart(promo);
                                });
                            }
                        }
                        return true;
                    }
                    return false;
                }
            });

            webView.android.setWebViewClient(new CustomWebViewClient());
        } catch (e) {
            console.log("Error WebViewClient:", e);
        }
    }
}

export function onLoadStarted(args: any) {
    const url: string = args.url;
    if (url && (url.includes('select-promo') || url.includes('id='))) {
        const match = url.match(/id=(\d+)/);
        if (match && match[1] && vm) {
            const id = parseInt(match[1], 10);
            const promo = vm.promotions.find(p => p.id === id);
            if (promo) {
                Utils.dispatchToMainThread(() => {
                    vm.selectProductForCart(promo);
                });
            }
        }
    }
}

export function onPromoCardTap(args: EventData) {
    const view = <View>args.object;
    const promo: PromoProduct = view.bindingContext;
    if (promo && vm) {
        vm.selectProductForCart(promo);
    }
}
