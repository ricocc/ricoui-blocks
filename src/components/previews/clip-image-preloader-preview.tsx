import { ClipImagePreloader } from '../../../registry/clip-image-preloader'
import { PreloaderPreviewFrame, preloaderPreviewImages } from './preloader-preview-frame'

export default function ClipImagePreloaderPreview() {
  return <PreloaderPreviewFrame images={preloaderPreviewImages}>{props => <ClipImagePreloader {...props} images={preloaderPreviewImages} logo={<span>RicoUI</span>} />}</PreloaderPreviewFrame>
}
