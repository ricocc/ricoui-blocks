import { StepOverlapPreloader } from '../../../registry/step-overlap-preloader'
import { PreloaderPreviewFrame } from './preloader-preview-frame'

export default function StepOverlapPreloaderPreview() {
  return <PreloaderPreviewFrame>{props => <StepOverlapPreloader {...props} />}</PreloaderPreviewFrame>
}
