import ReactDOM from 'react-dom';
import { OverlayView } from 'react-google-maps';
import { OVERLAY_VIEW } from 'react-google-maps/lib/constants';

export default class CustomOverlayView extends OverlayView {
    onRemove() {
        if (this.containerElement) {
            this.containerElement.parentNode.removeChild(this.containerElement);
            ReactDOM.unmountComponentAtNode(this.containerElement);
            this.containerElement = null;
        }
    }
}