import joi from "joi";
import { useState, useRef, useMemo, useCallback } from "react";
import { landmarksData } from "@/data/landmarks";
import CREATE_DESTINATION_RESTRICTIONS from "@/utils/restrictions/createDestination";
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
import Hiddable from "@/components/_utils/Hiddable";
import LandmarksNavigation from "@/components/admin/create_destination/landmarks/LandmarksNavigation";
import CreateNewLandmarkDialog from "@/components/admin/create_destination/landmarks/CreateNewLandmarkDialog";
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
    const [openCreateLandmarkDialog, setOpenCreateLandmarkDialog] = useState<boolean>(false);
    //
    const selectSlide = (index: number) => {
        setCurrentSlideIndex(index);
        swapper.current?.slickGoTo(index);
    };
    //
    // Validation
    //
    const { title, description, tag } = CREATE_DESTINATION_RESTRICTIONS.landmark;
    const validationScheme = joi.object({
        title: joi.string().min(title.min).max(title.max),
        description: joi.string().min(description.min).max(description.max),
        type: joi.valid("RESTAURANT", "MONUMENT", "ANTIQUE BUILDING", "RELIC", "ART", "NATURE"),
        tags: joi.array().items(joi.string().min(tag.min).max(tag.max)),
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
    //
    // Update the array of landmarks
    //
    const updateLandmark = (
        indexToModify: number, //
        valueAfterModification: Landmark | "REMOVE_THIS_ELEMENT" | "ADD_ELEMENT",
        newLandmarkTitle?: string
    ) => {
        // Remove certain landmark
        if (valueAfterModification === "REMOVE_THIS_ELEMENT") {
            selectSlide(0);
            if (landmarks.length === 1) setHideNavigation(false);
            setLandmarks(landmarks.filter((_: Landmark, index: number) => index !== indexToModify));
        }
        // Create a new landmark
        else if (valueAfterModification === "ADD_ELEMENT") {
            setLandmarks([
                ...landmarks,
                ...[
                    {
                        title: newLandmarkTitle as string,
                        description: "",
                        pictrue: null,
                        type: "ANTIQUE BUILDING",
                        tags: [],
                        pictureURL: "",
                    } as unknown as Landmark,
                ],
            ]);
            selectSlide(landmarks.length - 1);
            setHideNavigation(true);
        }
        // Update existing landmark
        else {
            setLandmarks(
                landmarks.map((value: Landmark, index: number) => {
                    if (indexToModify === index) return valueAfterModification;
                    else return value;
                })
            );
        }
    };

    return (
        <Fade in={true}>
            <Box className={styles["section-content-wrapper"]} component="section">
                <CreateNewLandmarkDialog
                    openDialog={{
                        value: openCreateLandmarkDialog, //
                        setValue: setOpenCreateLandmarkDialog,
                    }}
                    updateLandmark={updateLandmark}
                ></CreateNewLandmarkDialog>

                <Hiddable hide={hideNavigation} height={120}>
                    <SectionHeader text="Landmarks"></SectionHeader>
                </Hiddable>

                {(() => {
                    if (landmarks.length) {
                        return (
                            <LandmarksNavigation
                                currentSlideIndex={currentSlideIndex} //
                                landmarks={landmarks}
                                hideNavigation={hideNavigation}
                                selectSlide={selectSlide}
                                validationResults={validationResults}
                                addNewLandmark={() => setOpenCreateLandmarkDialog(true)}
                            ></LandmarksNavigation>
                        );
                    }
                })()}

                <LandmarksWrapper
                    hideNavigation={hideNavigation} //
                    swapper={swapper}
                    thereAreNoLandmarks={landmarks.length === 0}
                    addNewLandmark={() => setOpenCreateLandmarkDialog(true)}
                >
                    {landmarks.map((landmark: Landmark, index: number) => {
                        return (
                            <SingleLandmark
                                key={index} //
                                index={index}
                                currentSlideIndex={currentSlideIndex}
                                isValid={validationResults[index]}
                                data={landmark}
                                updateData={(data: Landmark | "REMOVE_THIS_ELEMENT") => updateLandmark(index, data)}
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
