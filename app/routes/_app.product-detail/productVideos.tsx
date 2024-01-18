import {Link} from '@remix-run/react';

const videoSrc = 'https://www.youtube.com/embed/tgbNymZ7vqY';

const VideoFrame = () => (
  <iframe width="420" height="345" src={videoSrc}></iframe>
);

const VideoLink = () => (
  <Link
    to={videoSrc}
    className="px-3 py-4 bg-[#171717CC] absolute bottom-[5px] min-w-[172px] text-white font-semibold text-base flex gap-[9px]"
  >
    Watch on
    <img src="YouTube.png" alt="" />
  </Link>
);

const videosData = [
  {id: 1, title: 'Video 1'},
  {id: 2, title: 'Video 2'},
  {id: 3, title: 'Video 3'},
  {id: 4, title: 'Video 4'},
  {id: 5, title: 'Video 5'},
];

const ProductVideos = () => (
  <>
    <h3 className="text-[30px] italic font-bold leading-[36px] mb-8 uppercase ">
      Videos
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 product-tab-video ">
      {videosData.map((video) => (
        <div key={video.id} className="relative">
          <VideoFrame />
          <VideoLink />
        </div>
      ))}
    </div>
  </>
);

export default ProductVideos;
