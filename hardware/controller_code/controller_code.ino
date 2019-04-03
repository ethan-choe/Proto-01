
int butt;
int swtch;


void setup() {
  Serial.begin(9600);
  pinMode(7, INPUT);
  pinMode(4, INPUT);
  
}

void loop() {
  // Demo of each command
  butt = digitalRead(4);
  swtch = digitalRead(7);
  
  if(swtch == HIGH)
  {
    Serial.print("l-");
  }
  else
  {
    Serial.print("r-");
  }

  if(butt == HIGH)
  {
    Serial.print("j-");
  }
  delay(200);
}
