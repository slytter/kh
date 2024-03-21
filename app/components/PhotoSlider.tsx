import {memo} from "react";


// import Swiper bundle with all modules installed
import Swiper from 'swiper/bundle';

// import styles bundle
import 'swiper/css/bundle';
import {useProjectStore} from "~/store/store";

// // init Swiper:
// const swiper = new Swiper({
//
// });

type Props = {
    initialIndex: number;
}


export const PhotoSlider = memo((props: Props) => {

    const {initialIndex} = props;

    const photos = useProjectStore((state) => state.draft.photos);

    return (
    <div className="swiper-container">
        <div className="swiper-wrapper">
            {photos.map((photo, index) => (
                <div className="swiper-slide" key={index}>
                    <img src={photo.url} alt={`Photo ${index}`} />
                </div>
            ))}
        </div>
        <div className="swiper-pagination"></div>
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
        </div>
    );

})
