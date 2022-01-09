// Tools
import joi from "joi";
import axios from "axios";
import Router from "next/router";
import { useState, useEffect } from "react";
import GuardedRoute from "@/utils/client/GuardedRoute";
// Types
import type { FunctionComponent } from "react";
import type { GetServerSideProps } from "next";
// Other components
import Link from "next/link";
import Image from "next/Image";
import StepHeader from "@/components/register/stepper/StepHeader";
import TextInput from "@/components/register/_formFields/TextInput";
import PasswordInput from "@/components/register/_formFields/PasswordInput";
// Material UI Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
// Material UI Icons
import Bolt from "@mui/icons-material/Bolt";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
// Redux
import { displaySnackbar } from "@/redux/slices/snackbar";
import { useAppDispatch } from "@/redux/hooks";
import { setAuthentication } from "@/redux/slices/authentication";
// Styles
import styles from "@/sass/pages/register.module.sass";
import bgIMGStyles from "@/sass/large_image_as_background.module.sass";
import backgroundImage from "@/public/images/login/bgc.jpg";

const Login: FunctionComponent<{}> = () => {
    const [email, setEmail] = useState<string>("jebac_gorzen@gmail.com");
    const [password, setPassword] = useState<string>("jebac_gorzen123");
    const [blockContinue, setBlockContinue] = useState<boolean>(true);
    const [credentialsDoNotMatch, setCredentialsDoNotMatch] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(false);
    //
    const dispatch = useAppDispatch();
    //
    // Validation
    //
    const joiScheme = joi.object({
        password: joi.string().min(6).max(255).trim(),
        email: joi.string().max(255).email({ tlds: false }),
    });
    const test = () => {
        const { error } = joiScheme.validate({ email, password });
        setBlockContinue(Boolean(error));
    };
    useEffect(test, [password, email, joiScheme]);
    //
    //
    //
    const continueClick = () => {
        if (blockContinue) return;
        setPending(true);
        setCredentialsDoNotMatch(false);
        axios
            .post("/api/auth/login", { email, password })
            .then(() => {
                dispatch(
                    displaySnackbar({
                        msg: "You have been successfully logged in!",
                        severity: "success",
                    })
                );
                dispatch(setAuthentication(null));
                Router.back();
            })
            .catch((e) => {
                const { status } = e.toJSON();
                if (status === 401) setCredentialsDoNotMatch(true);
                else if (status === 500) {
                    dispatch(
                        displaySnackbar({
                            msg: "Unknown error has occured! ",
                            severity: "error",
                        })
                    );
                }

                setPending(false);
            });
    };
    //
    //
    //
    return (
        <Fade in={true}>
            <Box className={bgIMGStyles.background}>
                <Image
                    className={bgIMGStyles["bg-image"]} //
                    src={backgroundImage}
                    layout="fill"
                    alt="background"
                    objectFit="cover"
                    objectPosition="center"
                    priority={true}
                    placeholder="blur"
                ></Image>
                <Card className={styles.formCard} sx={{ alignItems: "center", justifyContent: "center" }}>
                    {(() => {
                        if (pending) return <CircularProgress sx={{ position: "absolute", top: "20px", right: "20px" }}></CircularProgress>;
                    })()}

                    <Box className={styles["content-wrapper"]}>
                        <StepHeader
                            header="Login"
                            icon={
                                <Bolt
                                    sx={{
                                        fontSize: "20rem",
                                        ["@media (max-height:820px)"]: {
                                            fontSize: "15rem",
                                        },
                                        ["@media (max-height:760px)"]: {
                                            fontSize: "10rem",
                                        },
                                        ["@media (max-height:660px)"]: {
                                            fontSize: "7rem",
                                        },
                                    }}
                                ></Bolt>
                            }
                        ></StepHeader>
                        <TextInput
                            label="Email" //
                            value={email}
                            updateValue={setEmail}
                            buttonStyles={{ my: 1 }}
                            disabled={pending}
                        ></TextInput>
                        <PasswordInput
                            label="Password" //
                            value={password}
                            updateValue={setPassword}
                            buttonStyles={{ my: 1 }}
                            disabled={pending}
                        ></PasswordInput>
                        <Button variant="contained" sx={{ mt: 5 }} disabled={blockContinue || pending} onClick={continueClick}>
                            Continue
                        </Button>
                        {(() => {
                            if (credentialsDoNotMatch)
                                return (
                                    <Typography
                                        color="error.main"
                                        sx={{
                                            mt: 3, //
                                            fontWeight: "bold",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "default",
                                        }}
                                        variant="h6"
                                    >
                                        <ErrorOutline sx={{ mr: 1 }}></ErrorOutline>
                                        <span>Given credentials do not match</span>
                                    </Typography>
                                );
                            else
                                return (
                                    <Typography sx={{ mt: 3 }} variant="h6">
                                        <br />
                                    </Typography>
                                );
                        })()}
                    </Box>

                    <Divider sx={{ my: 1, width: "100%" }}></Divider>
                    <CardActions
                        sx={{
                            justifyContent: "center", //
                            mb: 1,
                            ["@media (max-width:470px)"]: {
                                flexDirection: "column",
                            },
                        }}
                    >
                        <Button>
                            <Link href="/register">
                                <a>Don&apos;t have an account? Create one</a>
                            </Link>
                        </Button>
                        <Button>
                            <Link href="/">
                                <a>Main page</a>
                            </Link>
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Fade>

        // /
    );
};

export const getServerSideProps: GetServerSideProps = (ctx) => GuardedRoute("anonymous", ctx);

export default Login;
