import {
  extractTextFromAudio,
  extractTextFromImage,
  getReadUrl,
  vectorizeData,
} from "@/service";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react";
import moment from "moment";
import _ from "lodash";

const Badge = (props: { state: "loading" | "success"; title: string }) => {
  return (
    <div className="px-5 py-2 rounded-xl border flex gap-3 items-center justify-center shadow bg-slate-300 flex-wrap max-md:text-xs">
      <p>{props.title}</p>
      {props.state === "loading" && <Spinner />}
      {props.state === "success" && <p>✅</p>}
    </div>
  );
};

const NetworkImage = (props: { fileId: string }) => {
  const [imageUrl, setImageUrl] = useState<any>(null);

  const fetchImageUrl = async () => {
    const fileUrl = await getReadUrl(props.fileId);
    setImageUrl(fileUrl);
  };
  useEffect(() => {
    fetchImageUrl();
  }, []);

  return (
    <>
      {!imageUrl && <p>Loading...</p>}
      {imageUrl && (
        <img src={imageUrl} className="w-[100%] h-[370px] object-contain" />
      )}
    </>
  );
};

const NetworkAudio = (props: { fileId: string }) => {
  const [audioUrl, setAudioUrl] = useState<any>(null);

  const fetchAudioUrl = async () => {
    const fileUrl = await getReadUrl(props.fileId);
    setAudioUrl(fileUrl);
  };
  useEffect(() => {
    fetchAudioUrl();
  }, []);

  return (
    <>
      {!audioUrl && <p>Loading...</p>}
      {audioUrl && (
        <audio className="w-[100%]" controls>
          <source src={audioUrl} />
        </audio>
      )}
    </>
  );
};

/**
 * dataSetState
 * 1 text extraction loading
 * 2 vectorization loading
 * 3 completed
 */

const DataCard = (props: any) => {
  const [dataSetState, setDataSetState] = useState<0 | 1 | 2 | 3>(
    props.extractedText ? (props.lastVectorizedOn ? 3 : 2) : 1
  );

  const extractText = async () => {
    setDataSetState(1);
    const newDataSet = _.cloneDeep(props.dataSet);
    const url = await getReadUrl(props.fileId);
    let extractedText: string = props.extractedText;
    if (props.type === "image") {
      extractedText = await extractTextFromImage(url);
    }
    if (props.type === "audio") {
      extractedText = await extractTextFromAudio(url);
    }
    newDataSet.dataSet = newDataSet.dataSet.map((item: any) => {
      if (item.id === props.id) {
        return { ...item, extractedText };
      }
      return item;
    });
    await props.updateDataSource(newDataSet);
    await vectorizeText(extractedText, newDataSet);
  };

  const vectorizeText = async (text: string, dataSet: any) => {
    setDataSetState(2);
    const newDataSet = _.cloneDeep(dataSet);
    await vectorizeData(text, props.id, props.userId);
    newDataSet.dataSet = newDataSet.dataSet.map((item: any) => {
      if (item.id === props.id) {
        return { ...item, lastVectorizedOn: new Date().getTime() };
      }
      return item;
    });
    await props.updateDataSource(newDataSet);
    setDataSetState(3);
  };

  useEffect(() => {
    if (!props.extractedText) {
      extractText();
      return;
    }
    if (!props.lastVectorizedOn) {
      vectorizeText(props.extractedText, props.dataSet);
    }
  }, []);

  return (
    <div className="w-[100%] lg:w-[60%] p-5 shadow border rounded-xl">
      <Tabs variant={"enclosed"}>
        <TabList>
          {props.type === "image" && <Tab>Image</Tab>}
          {props.type === "audio" && <Tab>Audio</Tab>}
          {props.type === "text" && <Tab>Text Entered</Tab>}
          {props.type === "audio" && <Tab>Transcription</Tab>}
          {props.type === "image" && <Tab>Description</Tab>}
        </TabList>

        <TabPanels>
          {props.type === "image" && (
            <TabPanel>
              <NetworkImage fileId={props.fileId} />
            </TabPanel>
          )}
          {props.type === "audio" && (
            <TabPanel>
              <NetworkAudio fileId={props.fileId} />
            </TabPanel>
          )}
          <TabPanel>
            <>
              {props.extractedText && <pre className="text-wrap gabarito-400">{props.extractedText}</pre>}
              {!props.extractedText && <p>Loading...</p>}
            </>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <hr className="my-5" />
      <div className="flex justify-between items-center">
        <p className="font-light text-xs max-md:hidden">
          Created {moment(props.createdAt).fromNow()}
        </p>
        <div className="flex gap-5">
          <Badge
            state={dataSetState > 1 ? "success" : "loading"}
            title="Text Extraction"
          />
          <Badge
            state={dataSetState > 2 ? "success" : "loading"}
            title="Vectorization"
          />
        </div>
      </div>
    </div>
  );
};

export default DataCard;
