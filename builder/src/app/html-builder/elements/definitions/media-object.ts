import {ArchitectElement} from '../architect-element';
import {hasClass} from '../../utils/has-class';

const template = `<div class="media">
  <a class="media-left" href="#">
    <img src="http://ironsummitmedia.github.io/startbootstrap-freelancer/img/profile.png" />
  </a>
  <div class="media-body">
    <h2 class="media-heading">Media heading</h2>
    <p>
      Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin
      commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum
      nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
    </p>
    <p>
      Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin
      commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum
      nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
    </p>
    <p>
      Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin
      commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum
      nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
    </p>
  </div>
</div>`;

export class MediaObjectEl extends ArchitectElement {
    name = 'media object';
    contentCategories = ['flow'];
    html = template;
    allowedContent = ['flow'];
    category = 'components';
    icon = 'perm-media';
    specificity = 3;
    hiddenClasses = ['media'];
    matcher(node: HTMLElement) {
        return hasClass(node, 'media');
    }
}
