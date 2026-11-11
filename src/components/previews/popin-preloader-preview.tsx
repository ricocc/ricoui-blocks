import { PopinPreloader } from '../../../registry/popin-preloader'
import { PreloaderPreviewFrame } from './preloader-preview-frame'

export default function PopinPreloaderPreview() {
  return <PreloaderPreviewFrame>{props => <PopinPreloader {...props} />}</PreloaderPreviewFrame>
}
