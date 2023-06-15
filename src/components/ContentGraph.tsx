import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Header, Segment, Icon } from "semantic-ui-react";
import { Loading } from "./common/widgets/widgets";
import { useAuth0 } from "@auth0/auth0-react";
import { getCg } from "../api";
import ChartGradeDistribution from "./common/chart-grade-distribution/chart-grade-distribution";

const Toc = () => {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState(null);
  useEffect(() => {
    if (!isLoading) {
      const update = async () => {
        const accessToken = isAuthenticated
          ? await getAccessTokenSilently()
          : null;
        getCg(accessToken).then((data) => setData({ ...data, accessToken }));
      };
      update();
    }
  }, [isLoading, isAuthenticated]);

  if (!data) {
    return <Loading />;
  }
  return (
    <>
      <Helmet>
        <title>{data.metadata.title}</title>
        <meta name="description" content={data.metadata.description} />
        <meta property="og:type" content="website" />
        <meta property="og:description" content={data.metadata.description} />
        <meta property="og:url" content={data.metadata.og.url} />
        <meta property="og:title" content={data.metadata.title} />
        <meta property="og:image" content={data.metadata.og.image} />
        <meta property="og:image:width" content={data.metadata.og.imageWidth} />
        <meta
          property="og:image:height"
          content={data.metadata.og.imageHeight}
        />
        <meta property="fb:app_id" content={data.metadata.og.fbAppId} />
      </Helmet>
      <Segment>
        <Header as="h2">
          <Icon name="area graph" />
          <Header.Content>
            Content Graph
            <Header.Subheader>{data.metadata.description}</Header.Subheader>
          </Header.Content>
        </Header>
        <ChartGradeDistribution
          accessToken={data.accessToken}
          idArea={0}
          idSector={0}
          data={data.gradeDistribution}
        />
      </Segment>
    </>
  );
};

export default Toc;
