// Tools
import RWD from "./RWD";
import { styled } from "@mui/system";
// Types
import type { Destination } from "@/@types/pages/destinations/ManyDestinations";
import type { FunctionComponent } from "react";
// Material UI Components
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
// Other components
import SingleLandmark from "./SingleLandmark";
import LandmarksHeader from "./LandmarksHeader";
import ReadMore from "@/components/_utils/ReadMore";
import DestinationPicture from "./DestinationPicture";
import FieldBackgroundMap from "@/components/_utils/FieldBackgroundMap";
import LocalizationBreadCrumbs from "@/components/_utils/LocalizationBreadCrumbs";
// Styled Components
import FlexBox from "@/components/_utils/styled/FlexBox";

const Wrapper = styled("div")(({ theme }) => ({
    ...(RWD as any),
}));

interface SingleDestinationProps {
    destination: Destination;
}
const SingleDestination: FunctionComponent<SingleDestinationProps> = (props) => {
    const { continent, country, folder, city, shortDescription, slug, landmarks } = props.destination;
    const localization: string[] = [continent.replaceAll("_", " "), country];

    return (
        <Fade in={true}>
            <Wrapper>
                <DestinationPicture
                    picture={folder} //
                    resolution="480p"
                    city={city}
                    country={country}
                ></DestinationPicture>
                <FlexBox column horizontal="start" className="single-destination-information">
                    <FieldBackgroundMap continent={continent}></FieldBackgroundMap>
                    <LocalizationBreadCrumbs crumbs={localization}></LocalizationBreadCrumbs>
                    <Typography variant="h2">{city}</Typography>
                    <Typography variant="body2">{shortDescription.slice(0, 130)}...</Typography>
                    <LandmarksHeader></LandmarksHeader>

                    <FlexBox horizontal="between" className="landmarks-wrapper">
                        {landmarks.map((item, index) => {
                            return (
                                <SingleLandmark
                                    folder={item.folder} //
                                    key={item.folder}
                                    slug={item.slug}
                                ></SingleLandmark>
                            );
                        })}
                    </FlexBox>
                    <ReadMore url={`/destinations/${slug}`}></ReadMore>
                </FlexBox>
            </Wrapper>
        </Fade>
    );
};

export default SingleDestination;
