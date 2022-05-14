// Tools
import { prisma } from "@/prisma/db";
import { styled } from "@mui/system";
import SingleDestinationAPI from "@/utils/api/pages/destinations/SingleDestinationAPI";
import { destinationPictureURL } from "@/utils/client/imageURLs";
// Types
import type { FunctionComponent } from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { Destination } from "@/@types/pages/destinations/SingleDestination";
// Other components
import Head from "next/Head";
import Stats from "@/components/destinations/single/Stats";
import ScrollStepper from "@/components/_utils/ScrollStepper";
import Reviews from "@/components/destinations/single/Reviews";
import ParallaxLanding from "@/components/_utils/ParallaxLanding";
import Landmarks from "@/components/destinations/single/Landmarks";
import Description from "@/components/destinations/single/Description";
// Redux
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setData, setRatings, setTotalReviews } from "@/redux/slices/singleDestination";
// Styled components
import RWDContentWrapper from "@/components/destinations/single/RWD";

const Content = styled("div")(({ theme }) => ({
    width: "100vw",
    position: "relative",
    marginTop: "100vh",
    paddingTop: "1px",
    background: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    "&::before": {
        content: "''",
        position: "absolute",
        top: "-20px",
        width: "100%",
        height: "50px",
        background: theme.palette.background.paper,
        transform: "rotate(-1deg)",
    },
}));

interface SingleDestinationProps {
    destination: Destination;
    ratings: number;
    totalReviews: number;
}

const SingleDestination: FunctionComponent<SingleDestinationProps> = (props) => {
    const { scrollY, width } = useAppSelector((state) => state.windowSizes);

    const { destination } = props;

    const dispatch = useAppDispatch();
    dispatch(setData(props.destination));
    dispatch(setRatings(props.ratings));
    dispatch(setTotalReviews(props.totalReviews));

    return (
        <>
            <Head>
                <title>{props.destination.city}</title>
            </Head>
            <RWDContentWrapper sx={{ color: "text.primary" }}>
                <ParallaxLanding
                    headers={{
                        main: destination.city,
                        top: destination.country,
                        bottom: destination.continent.replace("_", " "),
                    }}
                    text={destination.shortDescription}
                    imagesURLs={{
                        highResolution: destinationPictureURL(destination.folder, "1080p", "thumbnail"),
                        lowResolution: destinationPictureURL(destination.folder, "360p", "thumbnail"),
                    }}
                ></ParallaxLanding>

                <ScrollStepper
                    steps={[
                        { title: "Landing", elementID: "landing-wrapper" },
                        { title: "Description", elementID: "description" },
                        { title: "Landmarks", elementID: "landmarks" },
                        { title: "Reviews", elementID: "reviews" },
                    ]}
                ></ScrollStepper>

                <Content sx={{ "&::before": { opacity: scrollY ? 1 : 0 } }}>
                    <Stats></Stats>
                    <Description></Description>
                    <Landmarks></Landmarks>
                    <Reviews></Reviews>
                </Content>
            </RWDContentWrapper>
        </>
    );
};

export default SingleDestination;

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = (await prisma.destination.findMany({ select: { slug: true } })).map((item) => ({
        params: { slug: item.slug },
    }));
    return {
        paths,
        fallback: "blocking",
    };
};

export const getStaticProps: GetStaticProps<{ destination: Destination }, { slug: string }> = async (context) => {
    try {
        if (!context?.params?.slug) throw new Error();

        return {
            props: await new SingleDestinationAPI(context.params.slug).main(),
        };
    } catch (e: unknown) {
        return {
            redirect: {
                destination: "/404",
                permanent: false,
            },
        };
    }
};
