import React from 'react';

const BASE64_MARKER = ';base64,';

// https://gist.github.com/kylefox/c09a7b738aacf088c2ec2b359ddcc5ea

// Takes a file size (in bytes) and returns a human-friendly string representation.
export const humanFileSize = (size: number) => {
  if(size < 1) return "0 bytes";
  // http://stackoverflow.com/a/20732091
  let factor = 1000; // Technically it should be 1024, but looks like most apps use 1000...
  let i = Math.floor( Math.log(size) / Math.log(factor) );
  //@ts-ignore
  return ( size / Math.pow(factor, i) ).toFixed(1) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

// Does the given URL (string) look like a base64-encoded URL?
export const isDataURI = (url: string) => {
  return url.split(BASE64_MARKER).length === 2;
}

// Converts a data URI string into a File object.
export const dataURItoFile = (dataURI: string) => {
  if(!isDataURI(dataURI)) { return null; }

  // Format of a base64-encoded URL:
  // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYAAAAEOCAIAAAAPH1dAAAAK
  let mime = dataURI.split(BASE64_MARKER)[0].split(':')[1];
  let filename = 'dataURI-file-' + (new Date()).getTime() + '.' + mime.split('/')[1];
  let bytes = atob(dataURI.split(BASE64_MARKER)[1]);
  let writer = new Uint8Array(new ArrayBuffer(bytes.length));

  for (let i = 0; i < bytes.length; i++) {
    writer[i] = bytes.charCodeAt(i);
  }

  return new File([writer.buffer], filename, { type: mime });
}
