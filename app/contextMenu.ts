import { MessageAction, MediaType } from "./enums";
import { Media, MessageRequest, QueryMediaResponse, QueryMediaData, QueryMediaRequest } from "./definitions";
import { downloadFile } from "./download";
import { getFilenameParts, getExtensionFromMimeType, isValidExtension } from "./utils/file";
import * as logger from './logger';
import { CachedSettings } from "./settings";

enum ContextMenuItems {
    download = "download",
}

export function initializeContextMenu(settingsProvider: CachedSettings) {
    browser.contextMenus.onClicked.addListener(contextMenuListener);

    browser.contextMenus.create({
        id: ContextMenuItems.download,
        title: "Download with Raccoony",
        contexts: ['image', 'video', 'audio']
    });

    function contextMenuListener(info: browser.contextMenus.OnClickData, tab: browser.tabs.Tab) {
        logger.log("handling context menu", info.menuItemId);
        if (info.menuItemId === ContextMenuItems.download) {
            return queryPageMedia(tab, info.srcUrl)
                .then((response) => downloadMedia(info, response.media));
        }
    }

    function queryPageMedia(tab: browser.tabs.Tab, srcUrl: string) {
        return browser.tabs.executeScript(tab.id, { file: '/contextMenuInject.js' })
            .then(() => {
                // Ask the page about its media
                const message: QueryMediaRequest = {
                    action: MessageAction.PageQueryMedia,
                    data: { srcUrl },
                };
                return browser.tabs.sendMessage(tab.id, message) as Promise<QueryMediaResponse>;
            });
    }

    function downloadMedia(info: browser.contextMenus.OnClickData, media: Media) {
        const pageUrl = new URL(info.pageUrl);
        const itemUrl = new URL(info.srcUrl);
        const itemFile = itemUrl.pathname.split('/').pop();
        const mediaType: MediaType = info.mediaType as MediaType;

        media = Object.assign({
            siteName: pageUrl.hostname,
            filename: itemFile,
            siteFilename: itemFile,
            type: mediaType
        } as Media, media, { url: info.srcUrl, sourceUrl: info.pageUrl });

        const settings = media.siteName
            ? settingsProvider.getCurrentSettings(media.siteName)
            : settingsProvider.getDefaultSettings();
        const downloadPath = settings.contextDownloadPath;

        const finallyDownload = () => downloadFile(media, { downloadPath });

        if (!media.extension) {
            // Try to figure out the file's proper extension
            const { filename, ext } = getFilenameParts(itemFile);
            if (isValidExtension(ext, mediaType)) {
                // Try to use the extension in the filename if it is present.
                media.filename = filename
                media.extension = ext;
                return finallyDownload();
            }
            else {
                // Failing that, try to get the mime-type of the file by looking at the request headers
                return fetch(info.srcUrl)
                    .then((response) => {
                        const mimeType = response.headers.get('Content-Type');
                        logger.log('fetching file to determine extension', mimeType, response);
                        if (response.ok) {
                            media.extension = getExtensionFromMimeType(mimeType);
                        }
                        return finallyDownload();
                    })
                    .catch(finallyDownload);
            }
        }
        else {
            return finallyDownload();
        }
    }
}
