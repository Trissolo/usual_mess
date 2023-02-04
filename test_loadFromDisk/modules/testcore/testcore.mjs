export default class TestCore
{
  static fileArray = [{name:"A", things:[1,2,3]}, {name:"B", things:[4,5,6]}, {name:"C", things:[7,8,9]}];
  
  static findex = 0;

  static thingIndex = 0;

  static get currFile()
  {
    return this.fileArray[this.findex];
  }

  static get thing()
  {
    return this.currFile.things[this.thingIndex];
  }

  static nextFile()
  {
    this.findex = (this.findex + 1) % this.fileArray.length;
    
    this.thingIndex = 0;
  }

  static prevFile()
  {
    this.findex = (this.findex + this.fileArray.length - 1) % this.fileArray.length;
    
    this.thingIndex = 0;
  }
}
