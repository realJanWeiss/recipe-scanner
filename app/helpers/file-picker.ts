export async function openFilePicker(multiple = false) {
  const supportsFileSystemAccess
    = 'showOpenFilePicker' in window
      && (() => {
        try {
          return window.self === window.top;
        }
        catch {
          return false;
        }
      })();

  if (supportsFileSystemAccess) {
    let fileOrFiles: FileSystemFileHandle[] | undefined = undefined;
    try {
      fileOrFiles = await showOpenFilePicker({ multiple });
    }
    catch (err: unknown) {
      if (err instanceof DOMException && err.name !== 'AbortError') {
        console.error(err.name, err.message);
      }
    }
    return fileOrFiles;
  }
  return new Promise<FileList>((resolve) => {
    const input = document.createElement('input');
    input.style.display = 'none';
    input.type = 'file';
    document.body.append(input);
    if (multiple) {
      input.multiple = true;
    }
    input.addEventListener('change', () => {
      input.remove();
      if (!input.files) {
        return;
      }
      resolve(input.files);
    });
    if ('showPicker' in HTMLInputElement.prototype) {
      input.showPicker();
    }
    else {
      input.click();
    }
  });
};
