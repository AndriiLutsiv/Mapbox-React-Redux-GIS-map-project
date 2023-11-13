const mapMock = {
    getSource: jest.fn(),
    removeLayer: jest.fn(),
    removeSource: jest.fn()
  };
  
  export default {
    Map: jest.fn(() => mapMock)
  };