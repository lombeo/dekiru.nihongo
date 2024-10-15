import NoSSR from "@src/components/NoSSR";
import UIStarRatings from "react-star-ratings";

interface StarRatingsProps {
  rating: number;
  size?: "xl" | "lg" | "md" | "sm";
  changeRating?: (point) => void;
  color?: string;
}

const StarRatings = (props: StarRatingsProps) => {
  const { rating, color = "#F9BF0A", changeRating, size = "md" } = props;

  let starSpacing = "3px";
  let starDimension = "16px";

  switch (size) {
    case "xl":
      starSpacing = "5px";
      starDimension = "32px";
      break;
    case "lg":
      starSpacing = "5px";
      starDimension = "20px";
      break;
    case "sm":
      starSpacing = "1px";
      starDimension = "11px";
      break;
  }

  return (
    <NoSSR>
      <UIStarRatings
        rating={rating}
        starSpacing={starSpacing}
        starDimension={starDimension}
        starRatedColor={color}
        svgIconViewBox="0 0 28 27"
        svgIconPath="M13.0866 1.04906C13.439 0.258573 14.561 0.258571 14.9134 1.04906L18.1853 8.38939C18.3307 8.71542 18.6387 8.93926 18.9937 8.97673L26.9859 9.82026C27.8466 9.9111 28.1933 10.9782 27.5504 11.5576L21.5804 16.9377C21.3152 17.1767 21.1976 17.5388 21.2716 17.888L22.9391 25.7497C23.1187 26.5963 22.2109 27.2558 21.4612 26.8234L14.4996 22.8082C14.1904 22.6298 13.8096 22.6298 13.5004 22.8082L6.53877 26.8234C5.78907 27.2558 4.88134 26.5963 5.06091 25.7497L6.72838 17.888C6.80245 17.5388 6.68476 17.1767 6.4196 16.9377L0.449621 11.5576C-0.193292 10.9782 0.153429 9.9111 1.01411 9.82026L9.00627 8.97673C9.36125 8.93926 9.66935 8.71542 9.81468 8.38939L13.0866 1.04906Z"
        numberOfStars={5}
        changeRating={changeRating}
      />
    </NoSSR>
  );
};

export default StarRatings;
