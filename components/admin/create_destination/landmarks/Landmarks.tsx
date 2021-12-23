import joi from "joi";
import { useState, useRef, useMemo, useCallback } from "react";
import { landmarksData } from "@/data/landmarks";
// Types
import type { FunctionComponent } from "react";
import type { StatedDataField } from "@/@types/StagedDataField";
import type { Landmark } from "@/@types/Landmark";
// Material UI Components
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
// Other Components
import SectionHeader from "@/components/admin/create_destination/SectionHeader";
import BottomNavigation from "@/components/admin/create_destination/BottomNavigation";
import SingleLandmark from "./single_landmark/SingleLandmark";
import LandmarksWrapper from "@/components/admin/create_destination/landmarks/Wrapper";
import Hiddable from "@/components/admin/create_destination/landmarks/Hiddable";
import LandmarksNavigation from "@/components/admin/create_destination/landmarks/LandmarksNavigation";
import Slider from "react-slick";
// Styles
import styles from "@/sass/admin/create_destination.module.sass";

interface LandmarksInterface {
    // Auxiliary
    buttonStyles: Record<string, unknown>;
    stepperIndex: StatedDataField<number>;
}
const Landmarks: FunctionComponent<LandmarksInterface> = (props) => {
    const swapper = useRef<Slider | null>(null);
    const [landmarks, setLandmarks] = useState<Landmark[]>(landmarksData);
    const [hideNavigation, setHideNavigation] = useState<boolean>(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
    //
    // Validation
    //
    const validationScheme = joi.object({
        title: joi.string().min(3).max(50),
        description: joi.string().min(10).max(1024),
        type: joi.valid("RESTAURANT", "MONUMENT", "ANTIQUE BUILDING", "RELIC", "ART", "NATURE"),
        tags: joi.array().items(joi.string().min(3).max(25)),
    });
    const validateSingleLandmark = useCallback(
        () =>
            (landmark: Landmark): boolean => {
                const { title, description, picture, type, tags } = landmark;
                if (picture === null) return false;
                const { error } = validationScheme.validate({ title, description, type, tags });
                return !Boolean(error);
            },
        [validationScheme]
    );

    const validationResults = useMemo<boolean[]>(() => {
        return landmarks.map((landmark) => validateSingleLandmark()(landmark));
    }, [landmarks, validateSingleLandmark]);

    const updateLandmark = (indexToModify: number, valueAfterModification: Landmark) => {
        setLandmarks(
            landmarks.map((value: Landmark, index: number) => {
                if (indexToModify === index) return valueAfterModification;
                else return value;
            })
        );
    };
    const selectSlide = (index: number) => {
        setCurrentSlideIndex(index);
        swapper.current?.slickGoTo(index);
    };

    return (
        <Fade in={true}>
            <Box className={styles["section-content-wrapper"]} component="section">
                <Hiddable hide={hideNavigation} height={120}>
                    <SectionHeader text="Landmarks"></SectionHeader>
                </Hiddable>

                <LandmarksNavigation
                    currentSlideIndex={currentSlideIndex} //
                    landmarks={landmarks}
                    hideNavigation={hideNavigation}
                    selectSlide={selectSlide}
                    validationResults={validationResults}
                ></LandmarksNavigation>

                <LandmarksWrapper hideNavigation={hideNavigation} swapper={swapper}>
                    {landmarks.map((landmark: Landmark, index: number) => {
                        return (
                            <SingleLandmark
                                key={index} //
                                index={index}
                                currentSlideIndex={currentSlideIndex}
                                data={landmark}
                                updateData={(data: Landmark) => updateLandmark(index, data)}
                                hideNavigation={{ value: hideNavigation, setValue: setHideNavigation }}
                            ></SingleLandmark>
                        );
                    })}
                </LandmarksWrapper>

                <Hiddable hide={hideNavigation} height={80}>
                    <BottomNavigation
                        blockContinue={true} //
                        currentSlideIndex={props.stepperIndex.value}
                        updateSlideIndex={props.stepperIndex.setValue}
                    ></BottomNavigation>
                </Hiddable>
            </Box>
        </Fade>
    );
};

export default Landmarks;
