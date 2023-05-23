import {ArchitectElement} from '../architect-element';
import {hasClass} from '../../utils/has-class';

const template = `<header class="image-header">
<h3>Welcome to our studio!</h3>
    <h1>It's nice to meet you</h1>
    <p><a class="btn btn-primary btn-lg" role="button">Tell me more</a></p>
</header>`;

const style = `
.image-header {
    background-image: url(/builder/images/header-bg.jpg);
    background-position: center center;
    background-size: cover;
    text-align: center;
    padding: 300px 0 200px;
    color: #fff;
}

.image-header > h1 {
    font-size: 75px;
    font-weight: 700;
    margin-bottom: 50px;
    text-transform: uppercase;
}

.image-header > h3 {
    font-size: 40px;
    margin-bottom: 25px;
    font-style: italic;
}

.image-header > .btn-lg {
    padding: 20px 40px;
    font-size: 18px;
}
`;

export class ImageHeaderEl extends ArchitectElement {
    name = 'image header';
    contentCategories = ['flow'];
    html = template;
    css = style;
    allowedContent = ['flow'];
    category = 'components';
    icon = 'image';
    specificity = 3;
    matcher(node: HTMLElement) {
        return hasClass(node, 'image-header');
    }
}
