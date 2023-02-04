export default class TestCore
{
  //placeholder
  
  static fileArray = [{name:"A", things:[..."ABC"]}, {name:"B", things:[..."DEFG"]}, {name:"C", things:[..."HIJKL"]}];
  
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

  static get allThings()
  {
    return this.currFile.things
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

  static nextThing()
  {
    this.thingIndex = (this.thingIndex + 1) % this.allThings.length
  }

  static prevThing()
  {
    this.thingIndex = (this.thingIndex + this.allThings.length - 1) % this.allThings.length
  }

}
