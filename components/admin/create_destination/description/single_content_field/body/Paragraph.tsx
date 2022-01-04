// Tools
import { useState } from "react";
import { lengthRestrictionMessage, validateLength } from "@/utils/client/lenghRestrictionHelpers";
// Types
import type { Theme } from "@mui/system";
import type { FunctionComponent, ChangeEvent } from "react";
import type { Restriction } from "@/@types/Restriction";
import type { ParagraphContentField } from "@/@types/DestinationDescription";
// Material UI Components
import TextField from "@mui/material/TextField";

interface ParagraphBodyProps {
    fullscreen: boolean;
    data: ParagraphContentField;
    restrictions: Restriction;
    split?: true;
    updateSingleProp: (prop: keyof ParagraphContentField, val: ParagraphContentField[typeof prop]) => void;
}

const ParagraphBody: FunctionComponent<ParagraphBodyProps> = (props) => {
    const [newContent, setNewContent] = useState<string>(props.data.content);
    const [invalid, setInvalid] = useState<boolean>(false);

    const onBlur = () => {
        props.updateSingleProp("content", newContent);
        setInvalid(validateLength(newContent, props.restrictions));
    };
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewContent(e.target.value);
        if (invalid) setInvalid(validateLength(newContent, props.restrictions));
    };

    return (
        <TextField
            value={newContent} //
            onChange={onChange}
            onBlur={onBlur}
            helperText={lengthRestrictionMessage(newContent, props.restrictions, "paragraph's content")}
            inputProps={{
                maxLength: props.restrictions.max,
                sx: {
                    rows: "5",
                    pr: "10px",
                    "&::-webkit-scrollbar": { width: "10px" },
                    "&::-webkit-scrollbar-track": { boxShadow: "inset 0 0 2px rgba(0,0,0,0.5)" },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: (theme: Theme) => theme.palette.primary.main,
                        borderRadius: "2px",
                    },
                },
            }}
            FormHelperTextProps={{ sx: { textAlign: "right" } }}
            error={invalid}
            sx={{ width: `100%` }}
            multiline={true}
            rows={props.fullscreen ? (props.split ? 20 : 10) : props.split ? 10 : 5}
        ></TextField>
    );
};

export default ParagraphBody;
