import React from "react";
import { Segment, Icon, Label, Header } from "semantic-ui-react";
import { postUserRegion } from "../../../api";

const ProfileSettings = ({ accessToken, userRegions }) => {
  if (!accessToken || !userRegions || userRegions.length === 0) {
    return <Segment>No data</Segment>;
  }
  return (
    <Segment>
      <Header as="h4">Specify the different regions you want to show</Header>
      {userRegions.map((ur) => {
        if (ur.enabled && ur.readOnly) {
          return (
            <Label color="blue" key={ur.id} active={false} size="mini">
              {ur.name}
              <Label.Detail>{ur.role ? ur.role : "Current site"}</Label.Detail>
            </Label>
          );
        } else if (ur.enabled && !ur.readOnly) {
          return (
            <Label
              color="blue"
              key={ur.id}
              active={true}
              size="mini"
              as="a"
              onClick={() => {
                postUserRegion(accessToken, ur.id, true)
                  .then(() => {
                    window.location.reload();
                  })
                  .catch((error) => {
                    console.warn(error);
                    alert(error.toString());
                  });
              }}
            >
              {ur.name}
              <Icon name="delete" />
            </Label>
          );
        } else {
          return (
            <Label
              key={ur.id}
              active={true}
              size="mini"
              as="a"
              onClick={() => {
                postUserRegion(accessToken, ur.id, false)
                  .then(() => {
                    window.location.reload();
                  })
                  .catch((error) => {
                    console.warn(error);
                    alert(error.toString());
                  });
              }}
            >
              <Icon name="add" />
              {ur.name}
            </Label>
          );
        }
      })}
    </Segment>
  );
};

export default ProfileSettings;
