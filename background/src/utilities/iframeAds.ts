/**
 * site https://pgl.yoyo.org/as/serverlist.php?hostformat=adblockplus;showintro=0
 * contains list of all iframe sources containing ads AdBlockPlus filters.
 * Shutdown extension fetches that list every time on start (list updates once every several days),
 * saves it in storage local and while crawling web page fetches list and filters found iframes.
 */

import { setStorageLocal, StorageLocalKeys } from 'common';

const adBlockPlusAdsSources = 'https://pgl.yoyo.org/as/serverlist.php?hostformat=adblockplus;showintro=0';

const additionalIframeSourcesToIgnore = [
    'https://clients5.google.com/pagead/drt/dn/',
    'ogs.google.com',
    'comments',
    'google_ads_iframe',
    'googleads',
    'googlesyndication.com',
    'facebook.com/v2.0/,plugins',
    'plugins/share_button.php',
    'plugins/like.php',
    'twitter.com/widgets/',
    'facebook.com/common/referer_frame.php',
    'recaptcha/api',
];

export const fetchIframeAdsSources = async() => {
     try {
        const iframeSourcesPage = await (await fetch(adBlockPlusAdsSources)).text();

        const result = iframeSourcesPage
                            .split('\n')
                            .filter((x) => x.includes('||'))
                            .map((x) => x.replace('||', ''))
                            .map((x) => x.replace('^', ''));

        result.push(...additionalIframeSourcesToIgnore);

        if (result.length > additionalIframeSourcesToIgnore.length) {
            await setStorageLocal(StorageLocalKeys.IframeAdsSources, result);
        } else {
            await setStorageLocal(StorageLocalKeys.IframeAdsSources, additionalIframeSourcesToIgnore);
        }
     } catch (ex) {
        await setStorageLocal(StorageLocalKeys.IframeAdsSources, additionalIframeSourcesToIgnore);

        console.error(ex);
     }
 };
