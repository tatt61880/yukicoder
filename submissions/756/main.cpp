#include <iostream>
#include <vector>
#include <algorithm>
#include <cstring>
using namespace std;
#define repX(a,b,c,x,...) x
#define repN(a) repX a
#define rep(...) repN((__VA_ARGS__,rep3,rep2,loop))(__VA_ARGS__)
#define rep2(i,n) rep3(i,0,n)
#define rep3(i,begin,end) for(int i=(int)(begin),i##_end=(int)(end);i<i##_end;++i)

int main(){
  int D;
  cin >> D;
  char s[1000] = ".";
  rep(i, 1, 100){
    char buff[1000];
    strcpy(buff, s);
    sprintf(s, "%s%d", buff, i);
  }
  cout << s[D] << endl;
  return 0;
}
