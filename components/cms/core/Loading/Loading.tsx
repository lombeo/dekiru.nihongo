import { LoadingOverlay } from '@mantine/core';

function Loading(prop: any) {
  const {visible} = prop;
  return <LoadingOverlay style={{position: 'fixed'}} visible={visible} />
}

export default Loading