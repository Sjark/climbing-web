import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Segment, Header, Pagination, Loader, Feed } from "semantic-ui-react";
import { Loading, LockSymbol } from "./common/widgets/widgets";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { getTicks } from "../api";

const Ticks = () => {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { page } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    const update = async () => {
      const accessToken = isAuthenticated
        ? await getAccessTokenSilently()
        : null;
      getTicks(accessToken, parseInt(page)).then((data) => {
        setData(data);
        setLoading(false);
      });
    };
    update();
  }, [isLoading, isAuthenticated, page]);

  if (isLoading || !data) {
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
        <div>
          <Header as="h3">Public ascents</Header>
        </div>
        {loading ? (
          <>
            <Loader
              active
              inline
              style={{ marginTop: "20px", marginBottom: "20px" }}
            />
            <br />
          </>
        ) : (
          <Feed>
            {data.ticks.map((t, i) => (
              <Feed.Event key={i} as={Link} to={`/problem/${t.problemId}`}>
                <Feed.Content>
                  <Feed.Summary>
                    <Feed.Date>{t.date}</Feed.Date> {t.areaName}{" "}
                    <LockSymbol
                      lockedAdmin={t.areaLockedAdmin}
                      lockedSuperadmin={t.areaLockedSuperadmin}
                    />{" "}
                    / {t.sectorName}{" "}
                    <LockSymbol
                      lockedAdmin={t.sectorLockedAdmin}
                      lockedSuperadmin={t.sectorLockedSuperadmin}
                    />{" "}
                    / {t.problemName}{" "}
                    <LockSymbol
                      lockedAdmin={t.problemLockedAdmin}
                      lockedSuperadmin={t.problemLockedSuperadmin}
                    />
                    <Feed.Meta>
                      {t.name} {t.problemGrade}
                    </Feed.Meta>
                  </Feed.Summary>
                </Feed.Content>
              </Feed.Event>
            ))}
          </Feed>
        )}
        <Pagination
          size="tiny"
          siblingRange={0}
          boundaryRange={0}
          defaultActivePage={data.currPage}
          totalPages={data.numPages}
          onPageChange={(e, data) => {
            const page = data.activePage;
            setLoading(true);
            navigate("/ticks/" + page);
          }}
        />
      </Segment>
    </>
  );
};

export default Ticks;
