int tiltpin = 2;
int buttJpin = 7;
int buttLpin = 4;
int buttRpin = 8;

int tilt;
int buttJ;
int buttL;
int buttR;


void setup()
{
  Serial.begin(9600);
  pinMode(tiltpin, INPUT_PULLUP);
  pinMode(buttJpin, INPUT);
  pinMode(buttLpin, INPUT);
  pinMode(buttRpin, INPUT);
}
 
void loop()
{
  tilt = digitalRead(tiltpin);
  buttJ = digitalRead(buttJpin);
  buttL = digitalRead(buttLpin);
  buttR = digitalRead(buttRpin);
  
  // Flip
//   Serial.print(tilt);
  if(tilt == HIGH) {
    Serial.print("b~");
  }
  else
  {
    Serial.print("t~");
  }

//  // Movement
  if(buttJ == HIGH)
  {
    Serial.print("j~");  
  }
  if(buttL == HIGH)
  {
    Serial.print("l~");
  }
  if(buttR == HIGH)
  {
    Serial.print("r~");
  }
  else
  {
    Serial.print("s~");
  }
  
  delay(200);
}
