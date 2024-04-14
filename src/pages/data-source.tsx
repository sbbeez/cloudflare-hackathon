import {
  findDiagnosis,
  getReadUrl,
  getReadWriteUrl,
  summarizeText,
} from "@/service";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataCard from "./components/DataCard";
import { nanoid } from "nanoid";
import mime from "mime-types";
import MarkdownPreview from "@uiw/react-markdown-preview";

export default () => {
  const userId = localStorage.getItem("userId");
  const [dataSet, setDataSet] = useState<any>({ dataSet: [] });
  const audioRef = useRef<any>();
  const navigate = useNavigate();

  const [textLoading, setTextLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [dataSourceLoading, setDataSourceLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [diagnosisLoading, setDiagnosisLoading] = useState(false);

  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<any>(null);
  const [audioFile, setAudioFile] = useState<any>(null);
  const [summary, setSummary] = useState("");
  const [diagnosis, setDiagnosis] = useState("");

  const fetchDataSource = async () => {
    setDataSourceLoading(true);
    const downloadUrl = await getReadUrl(`${userId!}.json`);
    try {
      const response = await axios.get(downloadUrl);
      setDataSet(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setDataSourceLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate("/", { replace: true });
    }
    fetchDataSource();
  }, []);

  const {
    isOpen: isOpenText,
    onOpen: onOpenText,
    onClose: onCloseText,
  } = useDisclosure();

  const {
    isOpen: isOpenImage,
    onOpen: onOpenImage,
    onClose: onCloseImage,
  } = useDisclosure();

  const {
    isOpen: isOpenAudio,
    onOpen: onOpenAudio,
    onClose: onCloseAudio,
  } = useDisclosure();

  const {
    isOpen: isOpenSummary,
    onOpen: onOpenSummary,
    onClose: onCloseSummary,
  } = useDisclosure();

  const {
    isOpen: isOpenDiagnosis,
    onOpen: onOpenDiagnosis,
    onClose: onCloseDiagnosis,
  } = useDisclosure();

  const updateDataSource = async (dataSource: { dataSet: any[] }) => {
    const { uploadUrl } = await getReadWriteUrl(`${userId!}.json`);
    setDataSet(dataSource);
    return await axios.put(uploadUrl, dataSource);
  };

  const onAddText = async () => {
    setTextLoading(true);
    const newDataSet = _.cloneDeep(dataSet);
    newDataSet.dataSet.push({
      type: "text",
      createdAt: new Date().getTime(),
      id: nanoid(),
      extractedText: text,
    });
    await updateDataSource(newDataSet);
    setText("");
    onCloseText();
    setTextLoading(false);
  };

  const onUploadImage = async () => {
    setImageLoading(true);
    const fileId = `${nanoid()}.${mime.extension(imageFile.type)}`;
    const { uploadUrl } = await getReadWriteUrl(fileId);
    const newDataSet = _.cloneDeep(dataSet);
    newDataSet.dataSet.push({
      type: "image",
      createdAt: new Date().getTime(),
      id: nanoid(),
      fileId,
    });
    await axios.put(uploadUrl, imageFile, {
      headers: {
        "Content-Type": imageFile.type,
      },
    });
    await updateDataSource(newDataSet);
    setImageFile(null);
    setImageLoading(false);
    onCloseImage();
  };

  const onUploadAudio = async () => {
    setAudioLoading(true);
    const fileId = `${nanoid()}.${mime.extension(audioFile.type)}`;
    const { uploadUrl } = await getReadWriteUrl(fileId);
    const newDataSet = _.cloneDeep(dataSet);
    newDataSet.dataSet.push({
      type: "audio",
      createdAt: new Date().getTime(),
      id: nanoid(),
      fileId,
    });
    await axios.put(uploadUrl, audioFile, {
      headers: {
        "Content-Type": audioFile.type,
      },
    });
    await updateDataSource(newDataSet);
    setAudioFile(null);
    onCloseAudio();
    setAudioLoading(false);
  };

  const onImageSelect = async (event: any) => {
    setImageFile(event.target.files[0] as any);
  };

  const onAudioSelect = async (event: any) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play();
    }
    setAudioFile(event.target.files[0] as any);
  };

  const onChangeUser = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const onSummarize = async () => {
    setSummaryLoading(true);
    const { summary } = await summarizeText(`${userId}.json`);
    setSummary(summary);
    onOpenSummary();
    setSummaryLoading(false);
  };

  const onFindDiagnosis = async () => {
    setDiagnosisLoading(true);
    const { response } = await findDiagnosis(`${userId}.json`);
    setDiagnosis(response);
    onOpenDiagnosis();
    setDiagnosisLoading(false);
  };

  const onAskQuestion = () => {
    navigate("/ask-a-question");
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center p-5 gap-6">
      <h1 className="text-xl">Your Personal Medical Advisor</h1>
      <div>
        <h1 className="flex gap-1 flex-wrap justify-center">
          Patient ID: <strong>{localStorage.getItem("userId")}</strong>{" "}
        </h1>
        <p
          onClick={onChangeUser}
          className="underline text-blue-500 cursor-pointer text-center"
        >
          change patient id
        </p>
      </div>
      <div className="flex gap-5 flex-wrap justify-center">
        <Button colorScheme="blue" onClick={onOpenText} variant="outline">
          Write Text ✍️
        </Button>
        <Button colorScheme="blue" onClick={onOpenImage} variant="outline">
          Upload Image 🌆
        </Button>
        <Button colorScheme="blue" onClick={onOpenAudio} variant="outline">
          Upload Audio 🔈
        </Button>
      </div>
      <Modal size={"xl"} isOpen={isOpenText} onClose={onCloseText}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Write Text</ModalHeader>
          <ModalBody>
            <textarea
              autoFocus
              rows={20}
              className="w-[100%] border-slate-900 p-2 outline-blue-700"
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCloseText}>
              Close
            </Button>
            <Button
              onClick={onAddText}
              colorScheme="blue"
              isLoading={textLoading}
            >
              Add Text
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal size={"xl"} isOpen={isOpenImage} onClose={onCloseText}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Image</ModalHeader>

          <ModalBody className="flex flex-col gap-5">
            <label
              className="w-[100%] flex items-center justify-center cursor-pointer flex-col p-5 rounded-xl border-2 border-dashed"
              htmlFor="input-image-file"
            >
              <h1 className="text-3xl">⬆️</h1>
              <h2>Upload Image File</h2>
              <p className="text-xs">.jpeg, .png, .webp images are supported</p>
              <p className="text-xs"> Must be less than 1MB</p>
            </label>
            <input
              onChange={onImageSelect}
              accept="image/jpeg, image/png, image/webp"
              id="input-image-file"
              hidden
              type="file"
            />
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                className="w-[100%] h-[370px] object-contain"
              />
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCloseImage}>
              Close
            </Button>
            <Button
              onClick={onUploadImage}
              colorScheme="blue"
              isLoading={imageLoading}
            >
              Upload Image
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal size={"xl"} isOpen={isOpenAudio} onClose={onCloseAudio}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Audio</ModalHeader>
          <ModalBody className="flex flex-col gap-5">
            <label
              className="w-[100%] flex items-center justify-center cursor-pointer flex-col p-5 rounded-xl border-2 border-dashed"
              htmlFor="input-audio-file"
            >
              <h1 className="text-3xl">⬆️</h1>
              <h2>Upload Audio File</h2>
              <p className="text-xs"> .webm, .mp3 formats are supported</p>
              <p className="text-xs"> Must be less than 1MB</p>
            </label>
            <input
              onChange={onAudioSelect}
              id="input-audio-file"
              hidden
              type="file"
              accept="audio/mpeg,audio/webm"
            />
            {audioFile && (
              <audio ref={audioRef} className="w-[100%]" controls>
                <source src={URL.createObjectURL(audioFile)} />
              </audio>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCloseAudio}>
              Close
            </Button>
            <Button
              onClick={onUploadAudio}
              colorScheme="blue"
              isLoading={audioLoading}
            >
              Upload Audio
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal size={"xl"} isOpen={isOpenSummary} onClose={onCloseSummary}>
        <ModalOverlay />
        <ModalContent
          marginLeft={100}
          marginRight={100}
          marginTop={5}
          marginBottom={5}
          maxH={"max-content"}
        >
          <ModalHeader>Summary ✨</ModalHeader>

          <ModalBody>
            <h1 className="text-xl">{summary}</h1>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onCloseSummary} colorScheme="blue">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal size={"full"} isOpen={isOpenDiagnosis} onClose={onCloseDiagnosis}>
        <ModalOverlay />
        <ModalContent
          marginLeft={100}
          marginRight={100}
          marginTop={5}
          marginBottom={5}
          maxH={"max-content"}
        >
          <ModalHeader>Diagnosis From AI 🪄</ModalHeader>

          <ModalBody>
            {/* <h1 className="text-xl">{diagnosis}</h1> */}
            <MarkdownPreview
              className="p-5 overflow-auto markdown"
              source={diagnosis}
              style={{
                background: "transparent",
                all: "revert",
                padding: "20px",
              }}
              wrapperElement={{
                "data-color-mode": "light",
              }}
            />
          </ModalBody>

          <ModalFooter>
            <Button onClick={onCloseDiagnosis} colorScheme="blue">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {dataSourceLoading && <p>Loading...</p>}
      <div className="overflow-auto w-[100%] flex flex-col items-center gap-5">
        {!dataSourceLoading &&
          dataSet.dataSet.map((item: any, index: number) => (
            <DataCard
              updateDataSource={updateDataSource}
              dataSet={dataSet}
              index={index}
              key={item.id}
              {...item}
              userId={userId}
            />
          ))}
        {!dataSourceLoading && !dataSet?.dataSet?.length && (
          <p>No Data Source Found, Start Creating One</p>
        )}
      </div>
      {!dataSourceLoading && dataSet?.dataSet?.length ? (
        <div className="flex gap-5 items-center m-5 flex-wrap justify-center">
          <Button
            onClick={onAskQuestion}
            colorScheme="blue"
            className="px-5 py-3"
            variant="outline"
          >
            Ask Questions 💬
          </Button>
          <Button
            colorScheme="blue"
            className="px-5 py-3"
            onClick={onSummarize}
            variant="solid"
            isLoading={summaryLoading}
          >
            Summarize 💫
          </Button>
          <Button
            colorScheme="blue"
            className="px-5 py-3"
            onClick={onFindDiagnosis}
            variant="solid"
            isLoading={diagnosisLoading}
          >
            Find Diagnosis 💊
          </Button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
