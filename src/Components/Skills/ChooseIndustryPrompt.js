import React from "react";
import {Button, DialogContent} from '@material-ui/core';
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";

export default function ChooseIndustryPrompt({closepromptDialog}) {

  return (
    <div>
      <div>
        <DialogContent className="text-center">
        <div align="right">
        <Icon
          path={mdiClose}
          size={1}
          horizontal
          vertical
          className="close"
          onClick={() => {
            closepromptDialog();
          }}
          rotate={180}
        />
      </div>
        <div className="row justify-content-center text-center p-3">
            <p>
              Hello, You must select an industry to be able to add skill(s).
            </p>
          </div>
        </DialogContent>
      </div>
    </div>
  );
}