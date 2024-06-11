import {
  faFileAlt,
  faFileAudio,
  faFileImage,
  faFileVideo,
  faFolder,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import {
  getAdminFiles,
  getAdminFolders,
  getUserFiles,
  getUserFolders,
} from '../../../redux/actionCreators/filefoldersActionCreators.js';
import SubNav from '../SubNav.js/index.jsx';


const FolderComponent = () => {
  const { folderId } = useParams();
  const [it, setIt] = React.useState([]);
  const [it2, setIt2] = React.useState([]);

  const { folders, isLoading, files } = useSelector(
    (state) => ({
      folders: state.filefolders.userFolders,
      files: state.filefolders.userFiles,
      isLoading: state.filefolders.isLoading,
      // userId: state.auth.userId,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();
  const history = useHistory();

  const adddocIds = (docId) => {
    // console.log("Added");
    setIt([...it, docId]);
  }
  const deletedocIds = (docId) => {
    // console.log("Deleted");
    setIt(it.filter(x=>x!==docId));
  }
  const addfileIds = (docId) => {
    // console.log("Added");
    setIt2([...it2, docId]);
  }
  const deletefileIds = (docId) => {
    // console.log("Deleted");
    setIt2(it2.filter(x=>x!==docId));
  }

  useEffect(() => {
    if (isLoading) {
      dispatch(getAdminFolders());
      dispatch(getAdminFiles());
    }
    if (!folders && !files) {
      dispatch(getUserFolders(folderId));
      dispatch(getUserFiles(folderId));
    }
  }, [dispatch, folders, isLoading]);

  const userFolders =
    folders //&& folders.filter((file) => file.data.parentFolderId === folderId);

  const currentFolder =
    folders && folders.find((folder) => folder.Id == folderId);

  const createdFiles =
    files &&
    files.filter(
      (file) => file.data.parent === folderId && file.data.url === ''
    );

  const uploadedFiles =
    files &&
    files.filter(
      (file) => file.data.folderId == folderId 
    );

  if (isLoading) {
    return (
      <Row>
        <Col md="12">
          <h1 className="text-center my-5">Fetching data...</h1>
        </Col>
      </Row>
    );
  }

  if (
    userFolders &&
    userFolders.length < 1 &&
    createdFiles &&
    createdFiles.length < 1 &&
    uploadedFiles &&
    uploadedFiles.length < 1
  ) {
    return (
      <>
        <SubNav currentFolder={currentFolder} />
        <Row>
          <Col md="12">
            <p className="text-center small text-center my-5">Empty Folder</p>
          </Col>
        </Row>
      </>
    );
  }
  return (
    <>
    <Row>
      {/* Sidebar */}
      <Col md={2}>
        <SubNav currentFolder={currentFolder} docIds={it} fileIds={it2}/>
      </Col>
      <Col md={9}>
      {userFolders && userFolders.length > 0 && (
        <>
          <p className="text-center border-bottom py-2">Created Folders</p>
          <Row
            md="2"
            style={{ height: 'auto' }}
            className="pt-2  gap-2 pb-4 px-5">
            {!folders ? (
              <h1 className="text-center">Fetching Files....</h1>
            ) : (
              userFolders.map(({ data, docId }) => (
                <Col
                  onClick={(e) => {
                    if (e.currentTarget.classList.contains('text-white')) {
                      deletedocIds(docId);
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.classList.remove('text-white');
                      e.currentTarget.classList.remove('shadow-sm');
                    } else {
                      if(e.detail === 1) adddocIds(docId);
                      e.currentTarget.style.background = 'black';
                      e.currentTarget.classList.add('text-white');
                      e.currentTarget.classList.add('shadow-sm');
                    }
                  }}
                  onDoubleClick={() =>{
                    history.push(`/dashboard/folder/${docId}`)}
                  }
                  key={docId}
                  md={2}
                  className="border h-100 mr-2 d-flex align-items-center justify-content-around flex-column py-1 rounded-2">
                  <FontAwesomeIcon
                    icon={faFolder}
                    className="mt-3"
                    style={{ fontSize: '3rem', color: "#FFD43B" }}
                  />
                  <p className="text-center mt-3">{data.name}</p>
                </Col>
              ))
            )}
          </Row>
        </>
      )}
      {createdFiles && createdFiles.length > 0 && (
        <>
          <p className="text-center border-bottom py-2">Created Files</p>
          <Row
            md="2"
            style={{ height: 'auto' }}
            className="pt-2  gap-2 pb-4 px-5">
            {createdFiles.map(({ data, docId }) => (
              <Col
                onDoubleClick={() => history.push(`/dashboard/file/${docId}`)}
                onClick={(e) => {
                  if (e.currentTarget.classList.contains('text-white')) {
                    deletefileIds(docId);
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.classList.remove('text-white');
                    e.currentTarget.classList.remove('shadow-sm');
                  } else {
                    if(e.detail === 1) addfileIds(docId);
                    e.currentTarget.style.background = 'black';
                    e.currentTarget.classList.add('text-white');
                    e.currentTarget.classList.add('shadow-sm');
                  }
                }}
                key={docId}
                md={2}
                className="border h-100 mr-2 d-flex align-items-center justify-content-around flex-column py-1 rounded-2">
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="mt-3"
                  style={{ fontSize: '3rem' }}
                />
                <p className="text-center mt-3">{data.name}</p>
              </Col>
            ))}
          </Row>
        </>
      )}
      {uploadedFiles && uploadedFiles.length > 0 && (
        <>
          <p className="text-center border-bottom py-2">Uploaded Files</p>
          <Row
            md="2"
            style={{ height: 'auto' }}
            className="pt-2  gap-2 pb-4 px-5">
            {uploadedFiles.map(({ data, docId }) => (
              <Col
                onDoubleClick={() => history.push(`/dashboard/file/${docId}`)}
                onClick={(e) => {
                  if (e.currentTarget.classList.contains('text-white')) {
                    deletefileIds(docId);
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.classList.remove('text-white');
                    e.currentTarget.classList.remove('shadow-sm');
                  } else {
                    if(e.detail === 1) addfileIds(docId);
                    e.currentTarget.style.background = 'black';
                    e.currentTarget.classList.add('text-white');
                    e.currentTarget.classList.add('shadow-sm');
                  }
                }}
                key={docId}
                md={2}
                className="border h-100 mr-2 d-flex align-items-center justify-content-around flex-column py-1 rounded-2">
                <FontAwesomeIcon
                  icon={
                    data.fileName
                      .split('.')
                      [data.fileName.split('.').length - 1].includes('png') ||
                    data.fileName
                      .split('.')
                      [data.fileName.split('.').length - 1].includes('jpg') ||
                    data.fileName
                      .split('.')
                      [data.fileName.split('.').length - 1].includes('jpeg') ||
                    data.fileName
                      .split('.')
                      [data.fileName.split('.').length - 1].includes('svg') ||
                    data.fileName
                      .split('.')
                      [data.fileName.split('.').length - 1].includes('gif')
                      ? faFileImage
                      : data.fileName
                          .split('.')
                          [data.fileName.split('.').length - 1].includes('mp4') ||
                        data.fileName
                          .split('.')
                          [data.fileName.split('.').length - 1].includes('webm')
                      ? faFileVideo
                      : data.fileName
                          .split('.')
                          [data.fileName.split('.').length - 1].includes('mp3')
                      ? faFileAudio
                      : faFileAlt
                  }
                  className="mt-3"
                  style={{ fontSize: '3rem', color: "#8f9094",}}
                />
                <p className="text-center mt-3">{data.fileName}</p>
              </Col>
            ))}
          </Row>
        </>
      )}
      </Col>
    </Row>
    </>
  );
};

export default FolderComponent;